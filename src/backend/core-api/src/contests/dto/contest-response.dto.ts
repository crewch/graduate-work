import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Contest } from '@prisma/client';

export class ContestResponseDto implements Contest {
  @ApiProperty({ description: 'Уникальный идентификатор контеста' })
  contestId: string;

  @ApiProperty({ description: 'Название контеста' })
  title: string;

  @ApiProperty({ description: 'Подробное описание контеста' })
  description: string;

  @ApiProperty({
    description: 'Дата и время начала контеста',
    example: '2024-01-01T10:00:00Z',
  })
  startTime: Date;

  @ApiProperty({
    description: 'Дата и время окончания контеста',
    example: '2024-01-01T14:00:00Z',
  })
  endTime: Date;

  @ApiProperty({
    description: 'Текущий статус контеста',
    enum: $Enums.ContestStatus,
    example: 'ACTIVE',
  })
  status: $Enums.ContestStatus;

  @ApiProperty({
    description: 'ID создателя контеста',
    example: 'cm8m45vli0083s9rvmsn',
    nullable: true,
    required: false,
  })
  createdBy: string | null;

  @ApiProperty({
    description: 'Дата последнего обновления',
    example: '2024-01-01T12:30:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Дата создания контеста',
    example: '2024-01-01T09:00:00Z',
  })
  createdAt: Date;
}
