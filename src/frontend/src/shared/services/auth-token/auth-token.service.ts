import Cookies from 'js-cookie'
import { EnumTokens } from './types'

export const getAccessToken = () => {
	return Cookies.get(EnumTokens.ACCESS_TOKEN)
}

export const saveAccessToken = (accessToken: string) => {
	Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
		domain: 'localhost',
		sameSite: 'strict',
		expires: 1,
	})
}

export const removeAccessToken = () => {
	Cookies.remove(EnumTokens.ACCESS_TOKEN)
}
