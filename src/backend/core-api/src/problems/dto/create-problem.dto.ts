import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class ProblemSampleDto {
  @ApiProperty({
    example: '2 3',
    description: 'Входные данные для примера',
  })
  @IsString()
  @IsNotEmpty()
  input: string;

  @ApiProperty({
    example: '5',
    description: 'Выходные данные для примера',
  })
  @IsString()
  @IsNotEmpty()
  output: string;

  @ApiProperty({
    example: 'Сумма чисел 2 и 3',
    description: 'Пояснение к примеру',
    nullable: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  explanation: string | null;
}

export class TestCaseDto {
  @ApiProperty({
    example: '10 20',
    description: 'Входные данные для теста',
  })
  @IsString()
  @IsNotEmpty()
  input: string;

  @ApiProperty({
    example: '30',
    description: 'Ожидаемые выходные данные',
  })
  @IsString()
  @IsNotEmpty()
  output: string;
}

export class CreateProblemDto {
  @ApiProperty({
    example: 'Сумма двух чисел',
    description: 'Название задачи',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Найдите сумму двух чисел...',
    description: 'Описание задачи',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'Два целых числа через пробел',
    description: 'Формат входных данных',
  })
  @IsString()
  @IsNotEmpty()
  inputFormat: string;

  @ApiProperty({
    example: 'Одно целое число',
    description: 'Формат выходных данных',
  })
  @IsString()
  @IsNotEmpty()
  outputFormat: string;

  @ApiProperty({
    example: 1000,
    description: 'Лимит времени в миллисекундах',
  })
  @IsInt()
  @Min(1)
  timeLimit: number;

  @ApiProperty({
    example: 256,
    description: 'Лимит памяти в мегабайтах',
  })
  @IsInt()
  @Min(1)
  memoryLimit: number;

  @ApiProperty({
    type: [ProblemSampleDto],
    description: 'Примеры использования',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProblemSampleDto)
  samples: ProblemSampleDto[];

  @ApiProperty({
    type: [TestCaseDto],
    description: 'Тестовые случаи',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestCaseDto)
  testCases: TestCaseDto[];
}
