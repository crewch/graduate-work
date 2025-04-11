import { Controller } from '@nestjs/common';
import { JudgeService } from './judge.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('judge')
export class JudgeController {
  constructor(private readonly judgeService: JudgeService) {}

  @MessagePattern('submission.created')
  async handleSubmission(@Payload() submissionId: string) {
    await this.judgeService.judgeSubmission(submissionId);
  }
}
