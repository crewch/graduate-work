import { User } from '@/shared/model/prisma-types'

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
	user: User
}
