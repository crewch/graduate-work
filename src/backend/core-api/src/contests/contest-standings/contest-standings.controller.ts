import { Controller, Get, Param, Query } from '@nestjs/common';
import { ContestStandingsService } from './contest-standings.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
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
    type: PaginatedContestStandingsDto,
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
}
