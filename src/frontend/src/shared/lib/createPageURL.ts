export const createPageURL = (page: number) => {
	const params = new URLSearchParams()

	params.set('page', page.toString())

	return `?${params.toString()}`
}
