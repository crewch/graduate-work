import { ApiProperty } from '@nestjs/swagger';
import {
  ProgrammingLanguage,
  SubmissionResult,
  SubmissionStatus,
} from '@prisma/client';

export class SubmissionResultDto implements SubmissionResult {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Уникальный идентификатор посылки',
  })
  submissionId: string;

  @ApiProperty({
    example: 'test_123',
    description: 'Идентификатор теста',
  })
  testId: string;

  @ApiProperty({
    example: 'Ошибка компиляции',
    description: 'Сообщение об ошибке (если есть)',
  })
  errorMessage: string | null;

  @ApiProperty({
    example: 150,
    description: 'Время выполнения в миллисекундах',
  })
  executionTime: number | null;

  @ApiProperty({
    example: 2048,
    description: 'Использованная память в килобайтах',
  })
  memoryUsed: number | null;

  @ApiProperty({
    enum: SubmissionStatus,
    example: SubmissionStatus.ACCEPTED,
    description: 'Результат проверки',
  })
  status: SubmissionStatus;

  @ApiProperty({
    example: '2024-01-01T09:00:00Z',
  })
  createdAt: Date;
}

export class SubmissionResponseDto {
  @ApiProperty({
    example: 'console.log("Hello World!");',
    description: 'Исходный код решения',
  })
  code: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID конкурса',
  })
  contestId: string;

  @ApiProperty({
    enum: ProgrammingLanguage,
    example: ProgrammingLanguage.JAVASCRIPT,
    description: 'Использованный язык программирования',
  })
  language: ProgrammingLanguage;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID задачи',
  })
  problemId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID оригинальной посылки (для повторных попыток)',
  })
  submissionId: string;

  @ApiProperty({
    example: '2023-09-20T12:35:00.123Z',
    description: 'Время отправки решения',
  })
  submissionTime: Date;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID пользователя',
  })
  userId: string;

  @ApiProperty({
    enum: SubmissionStatus,
    example: SubmissionStatus.ACCEPTED,
    description: 'Результат проверки',
  })
  verdict: SubmissionStatus;

  lastResult: SubmissionResultDto;
}
