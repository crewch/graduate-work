export interface UpdateUserDto {
	username: string
	email: string
	passwordHash: string
	rating: number
}

export interface GetGlobalRatingResponseDto {
	contests: {
		username: string
		rating: number
	}[]
	total: number
}
