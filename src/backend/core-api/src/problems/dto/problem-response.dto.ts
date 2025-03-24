import { ApiProperty } from '@nestjs/swagger';
import { Problem, ProblemSample, TestCase } from '@prisma/client';

export class ProblemSampleResponseDto implements ProblemSample {
  sampleId: string;

  problemId: string;

  @ApiProperty({
    example: '2 3',
    description: 'Входные данные для примера',
  })
  input: string;

  @ApiProperty({
    example: '5',
    description: 'Выходные данные для примера',
  })
  output: string;

  @ApiProperty({
    example: 'Сумма чисел 2 и 3',
    description: 'Пояснение к примеру',
  })
  explanation: string | null;
}

export class TestCaseResponseDto implements TestCase {
  problemId: string;

  testId: string;

  @ApiProperty({
    example: '10 20',
    description: 'Входные данные для теста',
  })
  input: string;

  @ApiProperty({
    example: '30',
    description: 'Ожидаемые выходные данные',
  })
  output: string;
}

export class ProblemResponseDto implements Problem {
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

  samples: ProblemSampleResponseDto[];

  testCases: TestCaseResponseDto[];
}
