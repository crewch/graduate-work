import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateContestDto } from './create-contest.dto';
import { ContestStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateContestDto extends PartialType(CreateContestDto) {
  @ApiProperty({
    description: 'Текущий статус контеста',
    enum: ContestStatus,
    example: 'ACTIVE',
  })
  @IsEnum(ContestStatus)
  @IsOptional()
  status?: ContestStatus;
}
