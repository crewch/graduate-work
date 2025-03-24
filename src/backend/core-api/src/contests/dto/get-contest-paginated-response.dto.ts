import { ApiProperty } from '@nestjs/swagger';
import { Contest, ContestStatus } from '@prisma/client';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class ContestsPaginatedDto implements Contest {
  @ApiProperty({ description: 'Уникальный идентификатор контеста' })
  contestId: string;

  @ApiProperty({
    description: 'Название контеста',
    example: 'Осенний контест 2024',
  })
  title: string;

  @ApiProperty({
    description: 'Подробное описание контеста',
    example: 'Контест для начинающих разработчиков',
  })
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
    enum: ContestStatus,
    example: 'ACTIVE',
  })
  status: ContestStatus;

  @ApiProperty({
    description: 'ID создателя контеста',
    example: 'cm8m45vli0083s9rvmsn',
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

  creator: UserResponseDto;
}

export class GetContestPaginatedResponseDto {
  contests: ContestsPaginatedDto[];

  total: number;
}
