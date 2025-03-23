import { Injectable, NotFoundException } from '@nestjs/common';
import { SubmissionStatus } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ContestStandingsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStandings(contestId: string, page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;

    const [standings, total] = await Promise.all([
      this.prismaService.contestStanding.findMany({
        where: {
          contestId,
        },
        include: { user: { omit: { passwordHash: true } } },
        orderBy: [{ problemsSolved: 'desc' }, { penalty: 'asc' }],
        skip,
        take: pageSize,
      }),
      this.prismaService.contestStanding.count({
        where: {
          contestId,
        },
      }),
    ]);

    return {
      standings,
      total,
    };
  }

  async recalculateStandings(contestId: string) {
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
        const timeDiff =
          submission.submissionTime.getTime() - contest.startTime.getTime();
        const minutes = Math.floor(timeDiff / 60000);

        const failedAttempts = await this.prismaService.submission.count({
          where: {
            userId: submission.userId,
            problemId: submission.problemId,
            contestId,
            submissionTime: { lt: submission.submissionTime },
            verdict: { not: SubmissionStatus.ACCEPTED },
          },
        });

        participant.penalty += minutes + failedAttempts * 20;
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
}
