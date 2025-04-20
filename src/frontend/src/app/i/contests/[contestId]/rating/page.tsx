import { RatingPage } from '@/views/RatingPage'

export default async function Rating({
	params,
}: {
	params: Promise<{ contestId: string }>
}) {
	const { contestId } = await params

	return <RatingPage contestId={contestId} />
}
