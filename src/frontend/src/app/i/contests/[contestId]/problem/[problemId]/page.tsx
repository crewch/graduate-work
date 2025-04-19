import { ProblemDetailsPage } from '@/pages/ProblemDetailsPage'

export default async function ProblemDetails({
	params,
}: {
	params: Promise<{ contestId: string; problemId: string }>
}) {
	const { contestId, problemId } = await params

	return <ProblemDetailsPage contestId={contestId} problemId={problemId} />
}
