import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ContestProblemService } from './contest-problem.service';
import { ContestOwner } from '../decorators/contest-owner.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ContestProblemResponseDto } from './dto/contest-problem-response.dto';

@Auth()
@ApiBearerAuth()
@Controller('contests/:contestId/problems')
export class ContestProblemController {
  constructor(private readonly contestProblemService: ContestProblemService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все задачи контеста' })
  @ApiOkResponse({
    description: 'Список задач контеста',
    type: [ContestProblemResponseDto],
  })
  @ApiNotFoundResponse({ description: 'Контест не найден' })
  getProblems(@Param('contestId') contestId: string) {
    return this.contestProblemService.getContestProblems(contestId);
  }

  @Get(':problemId')
  @ApiOperation({ summary: 'Получить конкретную задачу контеста' })
  @ApiOkResponse({
    description: 'Информация о задаче',
    type: ContestProblemResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Контест/задача не найдены' })
  async getProblem(
    @Param('contestId') contestId: string,
    @Param('problemId') problemId: string,
  ) {
    const problem = await this.contestProblemService.getContestProblem(
      contestId,
      problemId,
    );

    if (!problem) {
      throw new NotFoundException(
        'Задача не найдена или контест не существует',
      );
    }

    return problem;
  }

  @Post(':problemId')
  @ContestOwner()
  @ApiOperation({ summary: 'Добавить задачу в контест' })
  @ApiCreatedResponse({
    description: 'Задача успешно добавлена',
    type: ContestProblemResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Контест не найден' })
  @ApiConflictResponse({ description: 'Контест/задача уже добавлена' })
  addProblem(
    @Param('contestId') contestId: string,
    @Param('problemId') problemId: string,
  ) {
    return this.contestProblemService.addProblemToContest(contestId, problemId);
  }

  @Delete(':problemId')
  @HttpCode(204)
  @ContestOwner()
  @ApiOperation({ summary: 'Удалить задачу из контеста' })
  @ApiNoContentResponse({ description: 'Задача успешно удалена' })
  @ApiNotFoundResponse({ description: 'Контест/задача не найдены' })
  async removeProblem(
    @Param('contestId') contestId: string,
    @Param('problemId') problemId: string,
  ) {
    await this.contestProblemService.removeContestProblem(contestId, problemId);
  }
}
