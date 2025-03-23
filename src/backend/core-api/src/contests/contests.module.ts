import { Module } from '@nestjs/common';
import { ContestsService } from './contests.service';
import { ContestsController } from './contests.controller';
import { PrismaModule } from 'nestjs-prisma';
import { ContestProblemService } from './contest-problem/contest-problem.service';
import { ContestProblemController } from './contest-problem/contest-problem.controller';
import { ContestStandingsController } from './contest-standings/contest-standings.controller';
import { ContestStandingsService } from './contest-standings/contest-standings.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    ContestsController,
    ContestProblemController,
    ContestStandingsController,
  ],
  providers: [ContestsService, ContestProblemService, ContestStandingsService],
})
export class ContestsModule {}
