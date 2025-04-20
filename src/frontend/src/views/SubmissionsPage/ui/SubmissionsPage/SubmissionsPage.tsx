'use client'

import { submissionsService } from '@/shared/services/submissions'
import {
	Badge,
	Button,
	Card,
	CardContent,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/shared/ui'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { HelpCircle, Loader } from 'lucide-react'
import { FC } from 'react'
import { DetailSubmissionDialog } from '../DetailSubmissionDialog'

interface SubmissionsPageProps {
	contestId: string
}

export const SubmissionsPage: FC<SubmissionsPageProps> = ({ contestId }) => {
	const { data, isLoading, isSuccess } = useQuery({
		queryKey: ['get-contest-submissions', contestId],
		queryFn: () => submissionsService.getSubmissions(contestId),
		refetchInterval: 5000,
	})

	return (
		<>
			{isLoading && <Loader className="animate-spin mx-auto" />}
			{isSuccess && !data.length && (
				<p className="flex justify-center">Посылок пока нет</p>
			)}
			{isSuccess && data.length > 0 && (
				<Card className="max-h-[700px]">
					<CardContent className="overflow-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-3">№</TableHead>
									<TableHead>Задача</TableHead>
									<TableHead>Язык</TableHead>
									<TableHead>Вердикт</TableHead>
									<TableHead>Время отправки</TableHead>
									<TableHead>Детали</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.map((submission, index) => (
									<TableRow key={submission.submissionId}>
										<TableCell>{index + 1}</TableCell>
										<TableCell>{submission.problem.title}</TableCell>
										<TableCell>
											<Badge variant="secondary">{submission.language}</Badge>
										</TableCell>
										<TableCell>
											<Badge
												variant={
													submission.verdict === 'PENDING'
														? 'outline'
														: submission.verdict === 'ACCEPTED'
														? 'positive'
														: 'destructive'
												}
												className={
													submission.verdict === 'PENDING'
														? 'animate-pulse'
														: ''
												}
											>
												{submission.verdict.replaceAll('_', ' ')}
											</Badge>
										</TableCell>
										<TableCell>
											{format(
												new Date(submission.submissionTime),
												'dd MMMM yyyy, HH:mm:ss'
											)}
										</TableCell>
										<TableCell>
											<DetailSubmissionDialog
												submissionResult={submission.results[0]}
											>
												<Button
													variant="outline"
													size="icon"
													disabled={!submission.results.length}
												>
													<HelpCircle />
												</Button>
											</DetailSubmissionDialog>
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
