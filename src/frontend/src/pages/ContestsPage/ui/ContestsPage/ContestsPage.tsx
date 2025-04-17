'use client'

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
import { contestService } from '@/shared/services/contests'
import { useQuery } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createPageURL } from '@/shared/lib'

export const ContestsPage = () => {
	const searchParams = useSearchParams()

	const page = Number(searchParams?.get('page')) || 1
	const pageSize = Number(searchParams?.get('pageSize')) || 20

	const { data, isLoading, isSuccess } = useQuery({
		queryKey: ['contests-list', page, pageSize],
		queryFn: () => contestService.getContests(page, pageSize),
		refetchInterval: 5000,
	})

	return (
		<div className="h-full flex flex-col gap-4">
			{isLoading && <Loader className="animate-spin mx-auto" />}
			{isSuccess && (
				<Card className="max-h-[800px]">
					<CardHeader>
						<CardTitle>Список соревнований</CardTitle>
						<CardDescription>
							Список текущих, прошедших и предстоящих соревнований по
							программированию
						</CardDescription>
					</CardHeader>
					<CardContent className="overflow-y-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>название</TableHead>
									<TableHead>статус</TableHead>
									<TableHead>автор</TableHead>
									<TableHead>время начала</TableHead>
									<TableHead>время окончания</TableHead>
									<TableHead>регистрация</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.contests.map(contest => (
									<TableRow key={contest.contestId}>
										<TableCell>{contest.title}</TableCell>
										<TableCell>{contest.status}</TableCell>
										<TableCell>{contest.creator.username}</TableCell>
										<TableCell>
											{new Date(contest.startTime).toLocaleString()}
										</TableCell>
										<TableCell>
											{new Date(contest.endTime).toLocaleString()}
										</TableCell>
										<TableCell>
											<Link
												href={`contests/${contest.contestId}`}
												className="hover:underline underline-offset-2"
											>
												Войти
											</Link>
										</TableCell>
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
										aria-disabled={page === Math.ceil(data.total / pageSize)}
										tabIndex={
											page === Math.ceil(data.total / pageSize) ? -1 : undefined
										}
										className={
											page === Math.ceil(data.total / pageSize)
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
