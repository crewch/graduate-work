import { ApiProperty } from '@nestjs/swagger';
import { ContestProblem } from '@prisma/client';

export class ContestProblemSlimResponseDto {
  @ApiProperty({ description: 'Уникальный идентификатор задачи' })
  problemId: string;

  @ApiProperty({
    example: 'Сумма двух чисел',
    description: 'Название задачи',
  })
  title: string;

  @ApiProperty({
    example: 'Найдите сумму двух чисел...',
    description: 'Описание задачи',
  })
  description: string;

  @ApiProperty({
    example: 'Два целых числа через пробел',
    description: 'Формат входных данных',
  })
  inputFormat: string;

  @ApiProperty({
    example: 'Одно целое число',
    description: 'Формат выходных данных',
  })
  outputFormat: string;

  @ApiProperty({
    example: 1000,
    description: 'Лимит времени в миллисекундах',
  })
  timeLimit: number;

  @ApiProperty({
    example: 256,
    description: 'Лимит памяти в мегабайтах',
  })
  memoryLimit: number;

  @ApiProperty({
    description: 'Идентификатор создателя задачи',
  })
  createdBy: string | null;

  @ApiProperty({ description: 'Дата создания задачи' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата последнего обновления задачи' })
  updatedAt: Date;
}

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
  })
  problem: ContestProblemSlimResponseDto;
}
