import axios from 'axios'
import { options } from './config'
import { authService } from '@/shared/services/auth'
import { getAccessToken, removeAccessToken } from '../services/auth-token'

const baseApi = axios.create(options)
const authApi = axios.create(options)

authApi.interceptors.request.use(config => {
	const accessToken = getAccessToken()

	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`
	}

	return config
})

authApi.interceptors.response.use(
	config => config,
	async error => {
		const originalRequest = error.config

		if (
			axios.isAxiosError(error) &&
			error.response?.status === 401 &&
			originalRequest &&
			!originalRequest._isRetry
		) {
			originalRequest._isRetry = true

			try {
				await authService.getNewTokens()

				return authApi.request(originalRequest)
			} catch (error) {
				if (axios.isAxiosError(error) && error.response?.status === 401) {
					removeAccessToken()
				}
			}
		}

		throw error
	}
)

export { baseApi, authApi }
