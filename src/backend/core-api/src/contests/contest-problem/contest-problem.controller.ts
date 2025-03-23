import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ContestProblemService } from './contest-problem.service';
import { ContestOwner } from '../decorators/contest-owner.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContestProblemResponseDto } from './dto/contest-problem-response.dto';

@Auth()
@ApiBearerAuth()
@Controller('contests/:contestId/problems')
export class ContestProblemController {
  constructor(private readonly contestProblemService: ContestProblemService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все задачи контеста' })
  @ApiResponse({
    status: 200,
    description: 'Список задач контеста',
    type: [ContestProblemResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Контест не найден' })
  getProblems(@Param('contestId') contestId: string) {
    return this.contestProblemService.getContestProblems(contestId);
  }

  @Get(':problemId')
  @ApiOperation({ summary: 'Получить конкретную задачу контеста' })
  @ApiResponse({
    status: 200,
    description: 'Информация о задаче',
    type: ContestProblemResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Контест/задача не найдены' })
  getProblem(
    @Param('contestId') contestId: string,
    @Param('problemId') problemId: string,
  ) {
    return this.contestProblemService.getContestProblem(contestId, problemId);
  }

  @Post(':problemId')
  @ContestOwner()
  @ApiOperation({ summary: 'Добавить задачу в контест' })
  @ApiResponse({
    status: 201,
    description: 'Задача успешно добавлена',
    type: ContestProblemResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Контест не найден' })
  @ApiResponse({ status: 409, description: 'Контест/задача уже добавлена' })
  addProblem(
    @Param('contestId') contestId: string,
    @Param('problemId') problemId: string,
  ) {
    return this.contestProblemService.addProblemToContest(contestId, problemId);
  }

  @Delete(':problemId')
  @ContestOwner()
  @ApiOperation({ summary: 'Удалить задачу из контеста' })
  @ApiResponse({ status: 200, description: 'Задача успешно удалена' })
  @ApiResponse({ status: 404, description: 'Контест/задача не найдены' })
  async removeProblem(
    @Param('contestId') contestId: string,
    @Param('problemId') problemId: string,
  ) {
    await this.contestProblemService.removeContestProblem(contestId, problemId);
  }
}
