'use client'

import { createPageURL } from '@/shared/lib'
import { contestService } from '@/shared/services/contests'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/shared/ui'
import { useQuery } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { FC } from 'react'

interface RatingPageProps {
	contestId: string
}

export const RatingPage: FC<RatingPageProps> = ({ contestId }) => {
	const searchParams = useSearchParams()

	const page = Number(searchParams.get('page')) || 1
	const pageSize = Number(searchParams.get('pageSize')) || 20

	const { data, isLoading, isSuccess } = useQuery({
		queryKey: ['get-contest-standings', contestId, page, pageSize],
		queryFn: () =>
			contestService.getContestStandings(contestId, page, pageSize),
		refetchInterval: 5000,
	})

	return (
		<div className="h-full flex flex-col items-center">
			{isLoading && <Loader className="animate-spin" />}
			{isSuccess && (
				<Card className="w-1/2 max-h-[800px]">
					<CardHeader>
						<CardTitle>Список лидеров</CardTitle>
						<CardDescription>
							Рейтинговая таблица участников соревнования.
						</CardDescription>
					</CardHeader>
					<CardContent className="overflow-y-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-3">№</TableHead>
									<TableHead>Имя пользователя</TableHead>
									<TableHead>Решенные задачи</TableHead>
									<TableHead>Штраф</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.standings.map(standing => (
									<TableRow key={standing.userId}>
										<TableCell>
											{standing.rank === 0 ? '-' : standing.rank}
										</TableCell>
										<TableCell>{standing.user.username}</TableCell>
										<TableCell>{standing.problemsSolved}</TableCell>
										<TableCell>{standing.penalty}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
					<CardFooter>
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href={createPageURL(page - 1)}
										aria-disabled={page <= 1}
										tabIndex={page <= 1 ? -1 : undefined}
										className={
											page <= 1 ? 'pointer-events-none opacity-50' : undefined
										}
									/>
								</PaginationItem>
								<PaginationItem>
									<PaginationNext
										href={createPageURL(page + 1)}
										aria-disabled={page >= Math.ceil(data?.total / pageSize)}
										tabIndex={
											page >= Math.ceil(data?.total / pageSize) ? -1 : undefined
										}
										className={
											page >= Math.ceil(data?.total / pageSize)
												? 'pointer-events-none opacity-50'
												: undefined
										}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</CardFooter>
				</Card>
			)}
		</div>
	)
}
