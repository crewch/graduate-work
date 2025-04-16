export const EnumTokens = {
	ACCESS_TOKEN: 'accessToken',
	REFRESH_TOKEN: 'refreshToken',
} as const

export type EnumTokens = keyof typeof EnumTokens
