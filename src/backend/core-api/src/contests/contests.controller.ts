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
import { ContestsService } from './contests.service';
import { CreateContestDto } from './dto/create-contest.dto';
import { UpdateContestDto } from './dto/update-contest.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { GetContestDto } from './dto/get-contest.dto';
import { ContestCreatedResponseDto } from './dto/contest-created-response.dto';
import { ContestOwner } from './decorators/contest-owner.decorator';
import { GetContestResponseDto } from './dto/get-contest-response.dto';
import { GetContestPaginatedResponseDto } from './dto/get-contest-paginated-response.dto';
import { ContestStandingResponseDto } from './dto/contest-standing-response.dto';

@Auth()
@ApiBearerAuth()
@Controller('contests')
export class ContestsController {
  constructor(private readonly contestService: ContestsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый контест' })
  @ApiCreatedResponse({
    description: 'Контест успешно создан',
    type: ContestCreatedResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Время начала должно быть меньше времени окончания',
  })
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateContestDto) {
    return this.contestService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все контесты' })
  @ApiOkResponse({
    description: 'Список контестов',
    type: GetContestPaginatedResponseDto,
  })
  findAll(@Query() dto: GetContestDto) {
    return this.contestService.findAll(dto.page, dto.pageSize);
  }

  @Get(':contestId')
  @ApiOperation({ summary: 'Получить контест по ID' })
  @ApiParam({ name: 'contestId', description: 'ID контеста' })
  @ApiOkResponse({
    description: 'Контест найден',
    type: GetContestResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Контест не найден',
  })
  findOne(@Param('contestId') contestId: string) {
    return this.contestService.findById(contestId);
  }

  @Patch(':contestId')
  @ContestOwner()
  @ApiOperation({ summary: 'Обновить контест' })
  @ApiParam({ name: 'contestId', description: 'ID контеста' })
  @ApiBody({ type: UpdateContestDto })
  @ApiOkResponse({
    description: 'Контест обновлен',
    type: ContestCreatedResponseDto,
  })
  update(@Param('contestId') contestId: string, @Body() dto: UpdateContestDto) {
    return this.contestService.update(contestId, dto);
  }

  @Delete(':contestId')
  @HttpCode(204)
  @ContestOwner()
  @ApiOperation({ summary: 'Удалить контест' })
  @ApiParam({ name: 'contestId', description: 'ID контеста' })
  @ApiNoContentResponse({
    description: 'Контест удален',
  })
  async remove(@Param('contestId') contestId: string) {
    await this.contestService.remove(contestId);
  }

  @Post(':contestId/register')
  @HttpCode(200)
  @ApiOperation({ summary: 'Зарегистрироваться на контест' })
  @ApiParam({ name: 'contestId', description: 'ID контеста' })
  @ApiOkResponse({
    description: 'Успешная регистрация',
    type: ContestStandingResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Контест не найден',
  })
  @ApiBadRequestResponse({
    description: 'Контест завершен',
  })
  register(
    @CurrentUser('userId') userId: string,
    @Param('contestId') contestId: string,
  ) {
    return this.contestService.registerParticipant(contestId, userId);
  }
}
