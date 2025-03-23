import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateContestDto {
  @ApiProperty({
    description: 'Название контеста',
    example: 'Стартовый контест по алгоритмам',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Подробное описание контеста',
    example:
      'Контест для начинающих разработчиков с задачами на базовые алгоритмы',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Дата и время начала контеста',
    example: '2024-01-01T10:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty({
    description: 'Дата и время окончания контеста',
    example: '2024-01-01T14:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @ApiProperty({
    description: 'Список ID задач для контеста',
    example: ['prob1', 'prob2', 'prob3'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  problemIds: string[];
}
