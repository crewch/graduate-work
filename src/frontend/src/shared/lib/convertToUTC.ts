export const convertToUTC = (localTime: string) => {
	return new Date(localTime).toISOString()
}
