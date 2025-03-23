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
import { ContestsService } from './contests.service';
import { CreateContestDto } from './dto/create-contest.dto';
import { UpdateContestDto } from './dto/update-contest.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import {
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GetContestDto } from './dto/get-contest.dro';
import { ContestResponseDto } from './dto/contest-response.dto';
import { ContestOwner } from './decorators/contest-owner.decorator';

@Auth()
@ApiBearerAuth()
@Controller('contests')
export class ContestsController {
  constructor(private readonly contestService: ContestsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый контест' })
  @ApiResponse({
    status: 201,
    description: 'Контест успешно создан',
    type: ContestResponseDto,
  })
  create(
    @CurrentUser('userId') userId: string,
    @Body() createContestDto: CreateContestDto,
  ) {
    return this.contestService.create(userId, createContestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все контесты' })
  @ApiResponse({
    status: 200,
    description: 'Список контестов',
    type: [ContestResponseDto],
  })
  findAll(@Query() dto: GetContestDto) {
    return this.contestService.findAll(dto.page, dto.pageSize);
  }

  @Get(':contestId')
  @ApiOperation({ summary: 'Получить контест по ID' })
  @ApiParam({ name: 'contestId', description: 'ID контеста' })
  @ApiResponse({
    status: 200,
    description: 'Контест найден',
    type: ContestResponseDto,
  })
  findOne(@Param('contestId') contestId: string) {
    return this.contestService.findById(contestId);
  }

  @Patch(':contestId')
  @ContestOwner()
  @ApiOperation({ summary: 'Обновить контест' })
  @ApiParam({ name: 'contestId', description: 'ID контеста' })
  @ApiBody({ type: UpdateContestDto })
  @ApiResponse({
    status: 200,
    description: 'Контест обновлен',
    type: ContestResponseDto,
  })
  update(
    @Param('contestId') contestId: string,
    @Body() updateContestDto: UpdateContestDto,
  ) {
    return this.contestService.update(contestId, updateContestDto);
  }

  @Delete(':contestId')
  @ContestOwner()
  @ApiOperation({ summary: 'Удалить контест' })
  @ApiParam({ name: 'contestId', description: 'ID контеста' })
  @ApiResponse({
    status: 204,
    description: 'Контест удален',
    type: ContestResponseDto,
  })
  remove(@Param('contestId') contestId: string) {
    return this.contestService.remove(contestId);
  }

  // todo добавить тип для swagger
  @Post(':contestId/register')
  @ApiOperation({ summary: 'Зарегистрироваться на контест' })
  @ApiParam({ name: 'contestId', description: 'ID контеста' })
  @ApiResponse({ status: 200, description: 'Успешная регистрация' })
  register(
    @CurrentUser('userId') userId: string,
    @Param('contestId') contestId: string,
  ) {
    return this.contestService.registerParticipant(contestId, userId);
  }
}
