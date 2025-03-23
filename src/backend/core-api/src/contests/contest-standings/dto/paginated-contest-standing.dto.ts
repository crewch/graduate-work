import { ApiProperty } from '@nestjs/swagger';
import { ContestStanding } from '@prisma/client';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class ContestStandingResponseDto implements ContestStanding {
  @ApiProperty({ example: 'cl123' })
  contestId: string;

  @ApiProperty({ example: 'user123' })
  userId: string;

  @ApiProperty({ example: 1 })
  rank: number;

  @ApiProperty({ example: 3 })
  problemsSolved: number;

  @ApiProperty({ example: 45 })
  penalty: number;

  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;
}

export class PaginatedContestStandingsDto {
  @ApiProperty({ type: [ContestStandingResponseDto] })
  standings: ContestStandingResponseDto[];

  @ApiProperty({ example: 50 })
  total: number;
}
