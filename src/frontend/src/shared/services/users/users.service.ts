import { authApi } from '@/shared/api'
import { GetGlobalRatingResponseDto, UpdateUserDto } from './types'
import { User } from '@/shared/model/prisma-types'

class UsersService {
	private BASE_URL = '/users'

	async getProfile() {
		const { data } = await authApi.get<User>(`${this.BASE_URL}/profile`)

		return data
	}

	async updateProfile(dto: UpdateUserDto) {
		const { data } = await authApi.patch<User>(`${this.BASE_URL}/profile`, dto)

		return data
	}

	async getGlobalRating(page: number = 1, pageSize: number = 20) {
		const { data } = await authApi.get<GetGlobalRatingResponseDto>(
			`${this.BASE_URL}/ratings`,
			{
				params: {
					page,
					pageSize,
				},
			}
		)

		return data
	}
}

export const userService = new UsersService()
