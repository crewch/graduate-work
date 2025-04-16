import { baseApi } from '@/shared/api/api'
import { AuthResponseDto, SignInDto, SignUpDto } from './types'
import { removeAccessToken, saveAccessToken } from '../auth-token'

class AuthService {
	private BASE_URL = '/auth'

	async signIn(dto: SignInDto) {
		const response = await baseApi.post<AuthResponseDto>(
			`${this.BASE_URL}/sign-in`,
			dto
		)

		saveAccessToken(response.data.accessToken)

		return response
	}

	async signUp(dto: SignUpDto) {
		const response = await baseApi.post<AuthResponseDto>(
			`${this.BASE_URL}/sign-up`,
			dto
		)

		saveAccessToken(response.data.accessToken)

		return response
	}

	async getNewTokens() {
		const response = await baseApi.post<AuthResponseDto>(
			`${this.BASE_URL}/sign-in/access-token`
		)

		saveAccessToken(response.data.accessToken)

		return response
	}

	async signOut() {
		await baseApi.post(`${this.BASE_URL}/sign-out`)

		removeAccessToken()
	}
}

export const authService = new AuthService()
