import { ApiProperty } from '@nestjs/swagger';
import { ContestProblem, Problem } from '@prisma/client';

export class ContestProblemResponseDto implements ContestProblem {
  @ApiProperty({ example: 'abc123', description: 'ID контеста' })
  contestId: string;

  @ApiProperty({ example: 'problem456', description: 'ID задачи' })
  problemId: string;

  @ApiProperty({
    example: 'A',
    description: 'Индекс проблемы в контесте',
  })
  problemIndex: string;

  @ApiProperty({
    description: 'Задача',
    // type: // todo добавить тип для swagger
  })
  problem: Problem;
}
