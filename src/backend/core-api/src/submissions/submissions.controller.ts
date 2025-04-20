import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { SubmissionResponseDto } from './dto/submission-response.dto';

@Auth()
@ApiBearerAuth()
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую посылку' })
  @ApiCreatedResponse({
    description: 'Посылка успешно создана',
  })
  @ApiBadRequestResponse({
    description: 'Контест ещё не начался или уже закончился',
  })
  async create(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateSubmissionDto,
  ) {
    await this.submissionsService.createSubmission(userId, dto);
  }

  @Get(':contestId')
  @ApiOperation({ summary: 'Получить собственные посылки контеста' })
  @ApiOkResponse({
    description: 'Список посылок',
    type: [SubmissionResponseDto],
  })
  async getSubmissions(
    @CurrentUser('userId') userId: string,
    @Param('contestId') contestId: string,
  ) {
    return this.submissionsService.getSubmissionResult(userId, contestId);
  }
}
