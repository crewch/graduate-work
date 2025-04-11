import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProgrammingLanguage } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubmissionDto {
  @IsString()
  @IsNotEmpty()
  contestId: string;

  @IsString()
  @IsNotEmpty()
  problemId: string;

  @ApiProperty({ enum: ProgrammingLanguage })
  @IsEnum(ProgrammingLanguage)
  language: ProgrammingLanguage;

  @IsString()
  @IsNotEmpty()
  code: string;
}
