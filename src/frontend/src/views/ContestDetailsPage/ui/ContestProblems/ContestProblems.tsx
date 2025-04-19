'use client'

import { contestService } from '@/shared/services/contests'
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	ProblemStatus,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/shared/ui'
import { useQuery } from '@tanstack/react-query'
import { Loader, Send } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'

interface ContestProblemsProps {
	contestId: string
}

export const ContestProblems: FC<ContestProblemsProps> = ({ contestId }) => {
	const { data, isSuccess, isLoading } = useQuery({
		queryKey: ['get-contest-problems', contestId],
		queryFn: () => contestService.getContestProblems(contestId),
	})

	return (
		<>
			{isLoading && <Loader className="animate-spin" />}
			{isSuccess && (
				<Card>
					<CardHeader>
						<CardTitle>Задачи</CardTitle>
					</CardHeader>
					<CardContent className="max-h-100 overflow-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-3">№</TableHead>
									<TableHead>Название</TableHead>
									<TableHead className="w-3">Статус</TableHead>
									<TableHead className="w-3">Отправить</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.map(problem => (
									<TableRow key={problem.problemId}>
										<TableCell>{problem.problemIndex}</TableCell>
										<TableCell>{problem.problem.title}</TableCell>
										<TableCell>
											<div className="flex justify-center">
												<ProblemStatus isSolved={problem.problem.isSolved} />
											</div>
										</TableCell>
										<TableCell>
											<div className="flex justify-center">
												<Button size={'icon'} variant={'outline'} asChild>
													<Link
														href={`${contestId}/problem/${problem.problemId}`}
													>
														<Send />
													</Link>
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			)}
		</>
	)
}
