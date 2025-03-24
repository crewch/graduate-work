import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateContestDto } from './dto/create-contest.dto';
import { UpdateContestDto } from './dto/update-contest.dto';
import { PrismaService } from 'nestjs-prisma';
import { ContestProblemService } from './contest-problem/contest-problem.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ContestStatus } from '@prisma/client';

@Injectable()
export class ContestsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly contestProblemService: ContestProblemService,
  ) {}

  async create(userId: string, dto: CreateContestDto) {
    return this.prismaService.$transaction(async (tx) => {
      const { problemIds, ...contestData } = dto;

      const now = new Date();

      if (contestData.startTime >= contestData.endTime) {
        throw new BadRequestException(
          'Время начала должно быть меньше времени окончания',
        );
      }

      if (contestData.startTime <= now) {
        throw new BadRequestException('Время начала должно быть в будущем');
      }

      const contest = await tx.contest.create({
        data: { createdBy: userId, ...contestData },
      });

      for (const problemId of problemIds) {
        await this.contestProblemService.addProblemToContest(
          contest.contestId,
          problemId,
          tx,
        );
      }

      return contest;
    });
  }

  async findAll(page: number = 1, pageSize: number = 10) {
    const [contests, total] = await Promise.all([
      this.prismaService.contest.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { creator: { omit: { passwordHash: true } } },
      }),
      this.prismaService.contest.count(),
    ]);

    return { contests, total };
  }

  async findById(contestId: string) {
    const contest = await this.prismaService.contest.findUnique({
      where: {
        contestId,
      },
      include: {
        problems: true,
        standings: { include: { user: { omit: { passwordHash: true } } } },
      },
    });

    if (!contest) {
      throw new NotFoundException('Контест не найден');
    }

    return contest;
  }

  async update(contestId: string, dto: UpdateContestDto) {
    return this.prismaService.$transaction(async (tx) => {
      const { problemIds, ...contestData } = dto;

      const contest = await tx.contest.update({
        where: {
          contestId,
        },
        data: contestData,
      });

      if (problemIds && problemIds.length) {
        await tx.contestProblem.deleteMany({
          where: { contestId },
        });

        for (const problemId of problemIds) {
          await this.contestProblemService.addProblemToContest(
            contest.contestId,
            problemId,
            tx,
          );
        }
      }

      return contest;
    });
  }

  async registerParticipant(contestId: string, userId: string) {
    const contest = await this.prismaService.contest.findUnique({
      where: { contestId },
    });

    if (!contest) {
      throw new NotFoundException('Контест не найден');
    }

    if (contest.status === 'FINISHED') {
      throw new BadRequestException('Контест завершен');
    }

    return this.prismaService.contestStanding.upsert({
      where: { contestId_userId: { contestId, userId } },
      update: {},
      create: {
        contestId,
        userId,
        rank: 0,
        problemsSolved: 0,
        penalty: 0,
      },
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateContestStatuses() {
    const now = new Date();

    const upcoming = await this.prismaService.contest.findMany({
      where: {
        status: ContestStatus.UPCOMING,
        startTime: { lte: now },
      },
    });

    for (const contest of upcoming) {
      await this.prismaService.contest.update({
        where: { contestId: contest.contestId },
        data: { status: ContestStatus.ONGOING },
      });
    }

    const ongoing = await this.prismaService.contest.findMany({
      where: {
        status: ContestStatus.ONGOING,
        endTime: { lte: now },
      },
    });

    for (const contest of ongoing) {
      await this.prismaService.contest.update({
        where: { contestId: contest.contestId },
        data: { status: ContestStatus.FINISHED },
      });
    }
  }

  remove(contestId: string) {
    return this.prismaService.contest.delete({ where: { contestId } });
  }
}
