export interface User {
	userId: string
	username: string
	email: string
	rating: number
	createdAt: string
	updatedAt: string
}

export interface UpdateUserDto {
	username: string
	email: string
	passwordHash: string
	rating: number
}

export interface GlobalRatingResponseDto {
	contests: {
		username: string
		rating: number
	}[]
	total: number
}
