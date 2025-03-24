import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { ProblemOwner } from './decorators/problem-owner.decorator';
import { GetProblemsDto } from './dto/get-problems.dto';
import { ProblemResponseDto } from './dto/problem-response.dto';

@Auth()
@ApiBearerAuth()
@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую задачу' })
  @ApiCreatedResponse({ type: ProblemResponseDto })
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateProblemDto) {
    return this.problemsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список задач' })
  @ApiOkResponse({ type: [ProblemResponseDto] })
  findAll(@Query() dto: GetProblemsDto) {
    return this.problemsService.findAll(dto.page, dto.pageSize);
  }

  @Get(':problemId')
  @ApiOperation({ summary: 'Получить задачу по ID' })
  @ApiOkResponse({ type: ProblemResponseDto })
  @ApiNotFoundResponse()
  findById(@Param('problemId') problemId: string) {
    return this.problemsService.findOne(problemId);
  }

  @Patch(':problemId')
  @ApiOperation({ summary: 'Обновить задачу' })
  @ApiOkResponse({ type: ProblemResponseDto })
  @ProblemOwner()
  update(@Param('problemId') problemId: string, @Body() dto: UpdateProblemDto) {
    return this.problemsService.update(problemId, dto);
  }

  @Delete(':problemId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Удалить задачу' })
  @ApiNoContentResponse()
  @ProblemOwner()
  async remove(@Param('problemId') problemId: string) {
    await this.problemsService.remove(problemId);
  }
}
