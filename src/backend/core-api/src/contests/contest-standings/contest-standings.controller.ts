import { Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { ContestStandingsService } from './contest-standings.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
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
  @ApiOkResponse({
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
  @HttpCode(204)
  @ApiOperation({ summary: 'Пересчитать таблицу лидеров контеста' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({
    description: 'Контест не найден',
  })
  async recalculate(@Param('contestId') contestId: string) {
    await this.contestStandingsService.recalculateStandings(contestId);
  }
}
