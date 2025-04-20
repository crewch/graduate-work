import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ContestStandingsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStandings(contestId: string, page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;

    const [standings, total] = await this.prismaService.$transaction([
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
}
