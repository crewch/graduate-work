import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import * as Docker from 'dockerode';
import {
  ProgrammingLanguage,
  Submission,
  SubmissionStatus,
  TestCase,
} from '@prisma/client';
import * as tar from 'tar-stream';
import { ConfigService } from '@nestjs/config';
import { finished } from 'stream/promises';
import { TestResult } from './interfaces/test-result.interface';

@Injectable()
export class JudgeService {
  private docker: Docker;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.docker = new Docker({
      socketPath: this.configService.get('DOCKER_SOCKET_PATH'),
      host: this.configService.get('DOCKER_HOST'),
      port: this.configService.get('DOCKER_PORT'),
    });
  }

  async judgeSubmission(submissionId: string) {
    const submission = await this.prismaService.submission.findUnique({
      where: { submissionId },
      include: { problem: { include: { testCases: true } }, contest: true },
    });

    if (!submission) {
      return;
    }

    const { language, code, problem } = submission;
    const image = this.getImage(language);
    const command = this.getCommand(language);

    const volumeName = `vol-${submissionId}-${Date.now()}`;
    let container: Docker.Container | undefined = undefined;

    try {
      await this.docker.createVolume({ Name: volumeName });

      container = await this.docker.createContainer({
        name: `sandbox_${submissionId}`,
        Image: image,
        Cmd: ['sh', '-c', 'tail -f /dev/null'],
        WorkingDir: '/app',
        HostConfig: {
          Binds: [`${volumeName}:/app`],
          Memory:
            Math.max(Math.min(problem.memoryLimit, 500), 10) * 1024 * 1024,
          MemorySwap: -1,
          NanoCpus: 2e9,
          NetworkMode: 'none',
          PidsLimit: 1024,
          SecurityOpt: ['no-new-privileges'],
          ReadonlyRootfs: true,
          CapDrop: ['ALL'],
        },
      });

      await container.start();
      await container.putArchive(this.createCodeArchive(code, language), {
        path: '/app',
      });

      const results: TestResult[] = [];
      let verdict: SubmissionStatus = 'ACCEPTED';

      for (const testCase of problem.testCases) {
        const testResult = await this.runTestInContainer(
          container.id,
          command,
          testCase,
          problem.timeLimit,
          problem.memoryLimit,
        );

        results.push(testResult);

        if (testResult.status !== 'ACCEPTED') {
          verdict = testResult.status;
          break;
        }
      }

      await this.prismaService.submission.update({
        where: { submissionId },
        data: {
          verdict,
          results: {
            deleteMany: {},
            createMany: {
              data: results,
            },
          },
        },
      });

      if (verdict === 'ACCEPTED') {
        const existingAccepted = await this.prismaService.submission.count({
          where: {
            contestId: submission.contestId,
            problemId: submission.problemId,
            userId: submission.userId,
            verdict: 'ACCEPTED',
            submissionTime: { lt: submission.submissionTime },
          },
        });

        if (existingAccepted === 0) {
          const problemPenalty = await this.calculateProblemPenalty(
            submission,
            submission.contest.startTime,
          );

          const ratingDelta = 1000 - problemPenalty;

          await this.prismaService.user.update({
            where: { userId: submission.userId },
            data: { rating: { increment: ratingDelta } },
          });

          await this.recalculateStandings(submission.contestId);
        }
      }
    } catch {
      await this.prismaService.submission.update({
        where: { submissionId },
        data: { verdict: 'FAILED' },
      });
    } finally {
      if (container) {
        await container.stop();
        await container.remove();
        await this.docker.getVolume(volumeName).remove();
      }
    }
  }

  private async recalculateStandings(contestId: string) {
    const contest = await this.prismaService.contest.findUnique({
      where: { contestId },
      include: {
        submissions: {
          where: {
            verdict: SubmissionStatus.ACCEPTED,
          },
          orderBy: {
            submissionTime: 'asc',
          },
        },
      },
    });

    if (!contest) throw new NotFoundException('Контест не найден');

    const participants = new Map<
      string,
      {
        solved: Set<string>;
        penalty: number;
      }
    >();

    for (const submission of contest.submissions) {
      const participant = participants.get(submission.userId) ?? {
        solved: new Set(),
        penalty: 0,
      };

      if (!participant.solved.has(submission.problemId)) {
        const problemPenalty = await this.calculateProblemPenalty(
          submission,
          contest.startTime,
        );

        participant.penalty += problemPenalty;
        participant.solved.add(submission.problemId);
        participants.set(submission.userId, participant);
      }
    }

    const sorted = Array.from(participants.entries()).sort((a, b) => {
      const solvedDiff = b[1].solved.size - a[1].solved.size;

      return solvedDiff !== 0 ? solvedDiff : a[1].penalty - b[1].penalty;
    });

    await this.prismaService.$transaction(
      sorted.map((entry, index) =>
        this.prismaService.contestStanding.upsert({
          where: { contestId_userId: { contestId, userId: entry[0] } },
          update: {
            rank: index + 1,
            problemsSolved: entry[1].solved.size,
            penalty: entry[1].penalty,
          },
          create: {
            contestId,
            userId: entry[0],
            rank: index + 1,
            problemsSolved: entry[1].solved.size,
            penalty: entry[1].penalty,
          },
        }),
      ),
    );
  }

  private async runTestInContainer(
    containerId: string,
    command: string[],
    testCase: TestCase,
    timeLimit: number,
    memoryLimit: number,
  ) {
    const result: TestResult = {
      testId: testCase.testId,
      status: 'PENDING',
      executionTime: null,
      memoryUsed: null,
      errorMessage: null,
      createdAt: new Date(),
    };

    const container = this.docker.getContainer(containerId);
    const exec = await container.exec({
      Cmd: command,
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
    });

    const stream = await exec.start({
      stdin: true,
      hijack: true,
      Tty: false,
    });

    let testCaseInput = testCase.input;

    if (!testCaseInput.endsWith('\n')) {
      testCaseInput = testCaseInput + '\n';
    }

    stream.write(testCaseInput);
    stream.end();

    let isPassedTest = false;

    const dockerDelay = 2100;

    const processStream = async () => {
      let stdout = '';
      let stderr = '';
      let buffer = Buffer.alloc(0);

      stream.on('data', (chunk: Buffer) => {
        buffer = Buffer.concat([buffer, chunk]);

        while (buffer.length >= 8) {
          const header = buffer.subarray(0, 8);
          const type = header.readUInt8(0);
          const length = header.readUInt32BE(4);

          if (buffer.length < 8 + length) break;

          const payload = buffer.subarray(8, 8 + length);
          buffer = buffer.subarray(8 + length);

          if (type === 1) stdout += payload.toString('utf8');
          if (type === 2) stderr += payload.toString('utf8');
        }
      });

      const startTime = performance.now();

      await finished(stream);

      const executionTime = Math.max(
        performance.now() - startTime - dockerDelay,
        10,
      );

      const errorMessage = stderr.length ? this.normalizeIO(stderr) : null;
      const stats = await container.stats({ stream: false });
      const memoryUsed = stats.memory_stats.stats.rss;

      if (this.normalizeIO(stdout) === this.normalizeIO(testCase.output)) {
        isPassedTest = true;
      }

      result.executionTime = executionTime;
      result.errorMessage = errorMessage;
      result.memoryUsed = memoryUsed;

      if (memoryUsed > memoryLimit * 1024 * 1024) {
        throw new Error('Memory limit exceeded');
      }
    };

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error('Time limit exceeded')),
        timeLimit + 10000,
      ),
    );

    try {
      await Promise.race([processStream(), timeoutPromise]);
      result.status = isPassedTest ? 'ACCEPTED' : 'WRONG_ANSWER';
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Time limit exceeded')) {
          result.status = 'TIME_LIMIT_EXCEEDED';
          result.errorMessage = 'Time limit exceeded';
        } else if (error.message.includes('Memory limit exceeded')) {
          result.status = 'MEMORY_LIMIT_EXCEEDED';
          result.errorMessage = 'Memory limit exceeded';
        } else {
          result.status = 'FAILED';
          result.errorMessage = error.message;
        }
      }
    }

    return result;
  }

  private async calculateProblemPenalty(
    submission: Submission,
    contestStartTime: Date,
  ) {
    const submissionTime = submission.submissionTime.getTime();
    const startTime = contestStartTime.getTime();
    const minutes = Math.floor((submissionTime - startTime) / 60000);

    const failedAttempts = await this.prismaService.submission.count({
      where: {
        userId: submission.userId,
        problemId: submission.problemId,
        contestId: submission.contestId,
        submissionTime: { lt: submission.submissionTime },
        verdict: { not: SubmissionStatus.ACCEPTED },
      },
    });

    return minutes + failedAttempts * 5;
  }

  private normalizeIO(str: string) {
    return str.replace(/[\r\n]+$/, '').trim();
  }

  private createCodeArchive(code: string, language: ProgrammingLanguage) {
    const pack = tar.pack();
    const filename = this.getFileName(language);

    pack.entry(
      {
        name: filename,
        mode: 0o644,
      },
      code,
    );
    pack.finalize();

    return pack;
  }

  private getFileName(language: ProgrammingLanguage) {
    switch (language) {
      case ProgrammingLanguage.PYTHON:
        return 'main.py';
      case ProgrammingLanguage.JAVASCRIPT:
        return 'main.js';
    }
  }

  private getImage(language: ProgrammingLanguage) {
    switch (language) {
      case ProgrammingLanguage.PYTHON:
        return 'python:3.13-slim';
      case ProgrammingLanguage.JAVASCRIPT:
        return 'node:22.14.0-slim';
    }
  }

  private getCommand(language: ProgrammingLanguage) {
    switch (language) {
      case ProgrammingLanguage.PYTHON:
        return ['python', '-u', './main.py'];
      case ProgrammingLanguage.JAVASCRIPT:
        return ['node', '--no-warnings', './main.js'];
    }
  }
}
