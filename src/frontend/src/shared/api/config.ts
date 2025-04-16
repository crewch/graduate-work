import { CreateAxiosDefaults } from 'axios'

export const options: CreateAxiosDefaults = {
	baseURL: process.env.NEXT_PUBLIC_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
}
