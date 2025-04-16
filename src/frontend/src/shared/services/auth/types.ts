export interface SignInDto {
	login: string
	password: string
}

export interface SignUpDto {
	username: string
	email: string
	password: string
}

export interface AuthResponseDto {
	accessToken: string
	user: {
		userId: string
		username: string
		email: string
		rating: number
		createdAt: string
		updatedAt: string
	}
}
