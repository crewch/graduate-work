'use client'

import { createPageURL } from '@/shared/lib'
import { userService } from '@/shared/services/users'
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

export const LeaderboardsPage = () => {
	const searchParams = useSearchParams()

	const page = Number(searchParams?.get('page')) || 1
	const pageSize = Number(searchParams?.get('pageSize')) || 20

	const { data, isLoading, isSuccess } = useQuery({
		queryKey: ['leaderboards-list', page, pageSize],
		queryFn: () => userService.getGlobalRating(page, pageSize),
		refetchInterval: 5000,
	})

	return (
		<div className="h-full flex flex-col gap-4">
			{isLoading && <Loader className="animate-spin mx-auto" />}
			{isSuccess && (
				<Card className="max-h-[800px]">
					<CardHeader>
						<CardTitle>Список лидеров</CardTitle>
						<CardDescription>
							Рейтинговая таблица участников за всё время.
						</CardDescription>
					</CardHeader>
					<CardContent className="overflow-y-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="max-w-5">№</TableHead>
									<TableHead>Имя пользователя</TableHead>
									<TableHead>Рейтинг</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.contests.map((user, index) => (
									<TableRow key={user.username}>
										<TableCell>{index + 1}</TableCell>
										<TableCell>{user.username}</TableCell>
										<TableCell>{user.rating}</TableCell>
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
