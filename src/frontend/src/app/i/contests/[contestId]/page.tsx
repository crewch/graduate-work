import { ContestDetailsPage } from '@/pages/ContestDetailsPage'

export default async function ContestDetails({
	params,
}: {
	params: Promise<{ contestId: string }>
}) {
	const { contestId } = await params

	return <ContestDetailsPage contestId={contestId} />
}
