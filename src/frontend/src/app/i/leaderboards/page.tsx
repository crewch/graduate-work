import { LeaderboardsPage } from '@/views/LeaderboardsPage'
import { Suspense } from 'react'

export default function Leaderboards() {
	return (
		<Suspense>
			<LeaderboardsPage />
		</Suspense>
	)
}
