'use client'

import {
	Badge,
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
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/shared/ui'
import { contestService } from '@/shared/services/contests'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createPageURL } from '@/shared/lib'
import { format } from 'date-fns'

export const ContestsPage = () => {
	const searchParams = useSearchParams()

	const page = Number(searchParams.get('page')) || 1
	const pageSize = Number(searchParams.get('pageSize')) || 20

	const { data, isLoading, isSuccess } = useQuery({
		queryKey: ['get-contests-list', page, pageSize],
		queryFn: () => contestService.getContests(page, pageSize),
		refetchInterval: 5000,
	})

	const { mutate } = useMutation({
		mutationKey: ['register-contests'],
		mutationFn: (contestId: string) =>
			contestService.registerContest(contestId),
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
						{!!data.total ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Название</TableHead>
										<TableHead>Статус</TableHead>
										<TableHead>Автор</TableHead>
										<TableHead>Время начала</TableHead>
										<TableHead>Время окончания</TableHead>
										<TableHead>Регистрация</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.contests.map(contest => (
										<TableRow key={contest.contestId}>
											<TableCell>{contest.title}</TableCell>
											<TableCell>
												{contest.status === 'UPCOMING' && (
													<Badge>{contest.status}</Badge>
												)}
												{contest.status === 'ONGOING' && (
													<Badge variant={'positive'}>{contest.status}</Badge>
												)}
												{contest.status === 'FINISHED' && (
													<Badge variant={'destructive'}>
														{contest.status}
													</Badge>
												)}
											</TableCell>
											<TableCell>{contest.creator.username}</TableCell>
											<TableCell>
												{format(
													new Date(contest.startTime),
													'dd MMMM yyyy, HH:mm:ss'
												)}
											</TableCell>
											<TableCell>
												{format(
													new Date(contest.endTime),
													'dd MMMM yyyy, HH:mm:ss'
												)}
											</TableCell>
											<TableCell>
												{contest.status === 'UPCOMING' ? (
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger
																className={'opacity-50 cursor-default'}
															>
																Войти
															</TooltipTrigger>
															<TooltipContent>
																<p>Соревнование ещё не началось</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												) : (
													<Link
														href={`contests/${contest.contestId}`}
														onClick={() => {
															if (contest.status === 'ONGOING') {
																mutate(contest.contestId)
															}
														}}
														className="hover:underline underline-offset-2"
													>
														Войти
													</Link>
												)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						) : (
							<p>Соревнования не найдены</p>
						)}
					</CardContent>
					{!!data.total && (
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
												page === Math.ceil(data.total / pageSize)
													? -1
													: undefined
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
					)}
				</Card>
			)}
		</div>
	)
}
