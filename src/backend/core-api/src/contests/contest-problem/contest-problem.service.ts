import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ContestProblemService {
  constructor(private readonly prismaService: PrismaService) {}

  async addProblemToContest(
    contestId: string,
    problemId: string,
    tx: Prisma.TransactionClient = this.prismaService,
  ) {
    const contestExists = await tx.contest.count({
      where: { contestId },
      take: 1,
    });

    if (!contestExists) {
      throw new NotFoundException('Контест не найден');
    }

    const problem = await tx.problem.findUnique({
      where: { problemId },
    });

    if (!problem) {
      throw new NotFoundException('Задача не найдена');
    }

    const existing = await tx.contestProblem.findUnique({
      where: {
        contestId_problemId: { contestId, problemId },
      },
    });

    if (existing) {
      throw new ConflictException('Задача уже добавлена');
    }

    const problemCount = await tx.contestProblem.count({
      where: { contestId },
    });

    const newIndex = this.generateProblemIndex(problemCount);

    return tx.contestProblem.create({
      data: {
        contestId,
        problemId,
        problemIndex: newIndex,
      },
      include: { problem: true },
    });
  }

  async getContestProblems(contestId: string) {
    const contestExists = await this.prismaService.contest.count({
      where: { contestId },
      take: 1,
    });

    if (!contestExists) {
      throw new NotFoundException('Контест не найден');
    }

    return this.prismaService.contestProblem.findMany({
      where: {
        contestId,
      },
      include: { problem: true },
      orderBy: { problemIndex: 'asc' },
    });
  }

  async getContestProblem(contestId: string, problemId: string) {
    const problem = await this.prismaService.contestProblem.findUnique({
      where: {
        contestId_problemId: { contestId, problemId },
      },
      include: { problem: true },
    });

    if (!problem) {
      throw new NotFoundException(
        'Задача не найдена или контест не существует',
      );
    }

    return problem;
  }

  removeContestProblem(contestId: string, problemId: string) {
    return this.prismaService.$transaction(async (tx) => {
      const existingProblem = await tx.contestProblem.findUnique({
        where: { contestId_problemId: { contestId, problemId } },
      });

      if (!existingProblem) {
        throw new NotFoundException('Контест/задача не найдены');
      }

      await tx.contestProblem.delete({
        where: {
          contestId_problemId: { contestId, problemId },
        },
      });

      const remainingProblems = await tx.contestProblem.findMany({
        where: {
          contestId,
        },
        orderBy: { problemIndex: 'asc' },
      });

      const updatePromises = remainingProblems.map((problem, index) => {
        const newIndex = String.fromCharCode(65 + index);

        return tx.contestProblem.update({
          where: {
            contestId_problemId: { contestId, problemId: problem.problemId },
          },
          data: { problemIndex: newIndex },
        });
      });

      await Promise.all(updatePromises);

      return existingProblem;
    });
  }

  private generateProblemIndex(n: number) {
    let index = '';

    while (n >= 0) {
      index = String.fromCharCode(65 + (n % 26)) + index;
      n = Math.floor(n / 26) - 1;
    }

    return index;
  }
}
