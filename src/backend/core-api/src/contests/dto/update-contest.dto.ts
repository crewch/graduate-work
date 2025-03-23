import { PartialType } from '@nestjs/swagger';
import { CreateContestDto } from './create-contest.dto';
import { ContestStatus } from '@prisma/client';

export class UpdateContestDto extends PartialType(CreateContestDto) {
  status?: ContestStatus;
}
