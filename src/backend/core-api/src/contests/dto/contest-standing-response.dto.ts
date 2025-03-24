import { ContestStanding } from '@prisma/client';

export class ContestStandingResponseDto implements ContestStanding {
  contestId: string;

  penalty: number;

  problemsSolved: number;

  rank: number;

  userId: string;
}
