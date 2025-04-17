class Contest {
  username: string;
  rating: number;
}

export class RatingResponseDto {
  contests: Contest[];

  total: number;
}
