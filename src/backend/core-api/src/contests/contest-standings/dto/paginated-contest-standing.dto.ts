import { ApiProperty } from '@nestjs/swagger';
import { ContestStanding } from '@prisma/client';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class ContestStandingResponseDto implements ContestStanding {
  @ApiProperty({ example: '12312312312' })
  contestId: string;

  @ApiProperty({ example: 'user123' })
  userId: string;

  @ApiProperty({ example: 1 })
  rank: number;

  @ApiProperty({ example: 3 })
  problemsSolved: number;

  @ApiProperty({ example: 45 })
  penalty: number;

  user: UserResponseDto;
}

export class PaginatedContestStandingsDto {
  standings: ContestStandingResponseDto[];

  @ApiProperty({ example: 50 })
  total: number;
}
