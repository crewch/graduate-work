import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ContestStandingsService } from './contest-standings.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetStandingsDto } from './dto/get-contest-standings.dto';
import { PaginatedContestStandingsDto } from './dto/paginated-contest-standing.dto';

@Auth()
@ApiBearerAuth()
@Controller('contests/:contestId/standings')
export class ContestStandingsController {
  constructor(
    private readonly contestStandingsService: ContestStandingsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Получить таблицу лидеров контеста' })
  @ApiResponse({
    status: 200,
    description: 'Успех',
    type: [PaginatedContestStandingsDto],
  })
  getStandings(
    @Param('contestId') contestId: string,
    @Query() dto: GetStandingsDto,
  ) {
    return this.contestStandingsService.getStandings(
      contestId,
      dto.page,
      dto.pageSize,
    );
  }

  @Post('recalculate')
  @ApiOperation({ summary: 'Пересчитать таблицу лидеров контеста' })
  @ApiResponse({ status: 201 })
  @ApiResponse({
    status: 404,
    description: 'Контест не найден',
  })
  async recalculate(@Param('contestId') contestId: string) {
    await this.contestStandingsService.recalculateStandings(contestId);
  }
}
