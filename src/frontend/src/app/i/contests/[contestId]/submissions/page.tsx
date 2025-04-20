import { SubmissionsPage } from '@/views/SubmissionsPage'

export default async function Submissions({
	params,
}: {
	params: Promise<{ contestId: string }>
}) {
	const { contestId } = await params

	return <SubmissionsPage contestId={contestId} />
}
