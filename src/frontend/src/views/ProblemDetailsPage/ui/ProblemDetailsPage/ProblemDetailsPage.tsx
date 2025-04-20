'use client'

import { FC } from 'react'
import { contestService } from '@/shared/services/contests'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	ProblemStatus,
} from '@/shared/ui'
import { useQuery } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import Link from 'next/link'
import { SendSubmissionDialog } from '../SendSubmissionDialog'

interface ProblemDetailsPageProps {
	contestId: string
	problemId: string
}

export const ProblemDetailsPage: FC<ProblemDetailsPageProps> = ({
	contestId,
	problemId,
}) => {
	const { data, isSuccess, isLoading } = useQuery({
		queryKey: ['get-contest-problem', contestId, problemId],
		queryFn: () => contestService.getContestProblem(contestId, problemId),
		refetchInterval: 5000,
	})

	return (
		<div className="flex flex-col items-center">
			{isLoading && <Loader className="animate-spin" />}
			{isSuccess && (
				<Card className="w-full">
					<CardHeader className="flex justify-between">
						<div>
							<CardTitle className="text-2xl flex items-center gap-2.5">
								{data.problemIndex}. {data.problem.title}
								<ProblemStatus isSolved={data.problem.isSolved} />
							</CardTitle>
							<CardDescription>
								<p>
									ограничение по времени на тест: {data.problem.timeLimit} мс
								</p>
								<p>
									ограничение по памяти на тест: {data.problem.memoryLimit} КБ
								</p>
							</CardDescription>
						</div>
						<div className="space-x-4">
							<SendSubmissionDialog contestId={contestId} problemId={problemId}>
								<Button>Отправить решение</Button>
							</SendSubmissionDialog>
							<Button asChild>
								<Link href={'..'}>Назад</Link>
							</Button>
						</div>
					</CardHeader>
					<CardContent className="flex flex-col gap-4 max-h-160 overflow-auto">
						<p>{data.problem.description}</p>
						<div>
							<h3 className="text-base font-bold">Входные данные</h3>
							<p>{data.problem.inputFormat}</p>
						</div>
						<div>
							<h3 className="text-base font-bold">Выходные данные</h3>
							<p>{data.problem.outputFormat}</p>
						</div>
						{data.problem.samples.map((sample, index) => (
							<Card key={sample.sampleId} className="gap-2">
								<CardHeader>
									<CardTitle>Пример {index + 1}</CardTitle>
								</CardHeader>
								<CardContent className="flex flex-col gap-2">
									<div>
										<h3 className="text-sm font-semibold">Входные данные</h3>
										<pre>{sample.input}</pre>
									</div>
									<div>
										<h3 className="text-sm font-semibold">Выходные данные</h3>
										<pre>{sample.output}</pre>
									</div>
									{sample.explanation && (
										<div>
											<h3 className="text-sm font-semibold">Описание</h3>
											<p>{sample.explanation}</p>
										</div>
									)}
								</CardContent>
							</Card>
						))}
					</CardContent>
				</Card>
			)}
		</div>
	)
}
