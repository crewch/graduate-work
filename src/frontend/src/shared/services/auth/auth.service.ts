import { baseApi } from '@/shared/api/api'
import { AuthResponseDto, SignInDto, SignUpDto } from './types'
import { removeAccessToken, saveAccessToken } from '../auth-token'

class AuthService {
	private BASE_URL = '/auth'

	async signIn(dto: SignInDto) {
		const { data } = await baseApi.post<AuthResponseDto>(
			`${this.BASE_URL}/sign-in`,
			dto
		)

		saveAccessToken(data.accessToken)

		return data
	}

	async signUp(dto: SignUpDto) {
		const { data } = await baseApi.post<AuthResponseDto>(
			`${this.BASE_URL}/sign-up`,
			dto
		)

		saveAccessToken(data.accessToken)

		return data
	}

	async getNewTokens() {
		const { data } = await baseApi.post<AuthResponseDto>(
			`${this.BASE_URL}/sign-in/access-token`
		)

		saveAccessToken(data.accessToken)

		return data
	}

	async signOut() {
		await baseApi.post(`${this.BASE_URL}/sign-out`)

		removeAccessToken()
	}
}

export const authService = new AuthService()
