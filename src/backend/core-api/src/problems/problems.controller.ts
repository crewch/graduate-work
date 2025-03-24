import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { ProblemOwner } from './decorators/problem-owner.decorator';
import { GetProblemsDto } from './dto/get-problems.dto';

@Auth()
@ApiBearerAuth()
@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Post()
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateProblemDto) {
    return this.problemsService.create(userId, dto);
  }

  @Get()
  findAll(@Query() dto: GetProblemsDto) {
    return this.problemsService.findAll(dto.page, dto.pageSize);
  }

  @Get(':problemId')
  findById(@Param('problemId') problemId: string) {
    return this.problemsService.findOne(problemId);
  }

  @Patch(':problemId')
  @ProblemOwner()
  update(@Param('problemId') problemId: string, @Body() dto: UpdateProblemDto) {
    return this.problemsService.update(problemId, dto);
  }
  // todo добавить тип для swagger везде
  @Delete(':problemId')
  @ProblemOwner()
  remove(@Param('problemId') problemId: string) {
    return this.problemsService.remove(problemId);
  }
}
