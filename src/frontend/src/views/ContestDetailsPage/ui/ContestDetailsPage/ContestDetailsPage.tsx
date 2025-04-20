'use client'

import { contestService } from '@/shared/services/contests'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/ui'
import { useQuery } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import { FC } from 'react'
import { ContestProblems } from '../ContestProblems'
import { format } from 'date-fns'

interface ContestDetailsPageProps {
	contestId: string
}

export const ContestDetailsPage: FC<ContestDetailsPageProps> = ({
	contestId,
}) => {
	const { data, isSuccess, isLoading } = useQuery({
		queryKey: ['get-contest', contestId],
		queryFn: () => contestService.getContest(contestId),
	})

	return (
		<div className="flex flex-col gap-2 items-center">
			{isLoading && <Loader className="animate-spin" />}
			{isSuccess && (
				<Card className="w-1/2">
					<CardHeader>
						<CardTitle>{data.title}</CardTitle>
						<CardDescription className="space-y-1">
							<p>{data.description}</p>
							<p>Статус: {data.status}</p>
							<p>
								Начало:{' '}
								{format(new Date(data.startTime), 'dd MMMM yyyy, HH:mm:ss')}
							</p>
							<p>
								Конец:{' '}
								{format(new Date(data.endTime), 'dd MMMM yyyy, HH:mm:ss')}
							</p>
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ContestProblems contestId={contestId} />
					</CardContent>
				</Card>
			)}
		</div>
	)
}
