'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CreateContestFormValues, formSchema } from './types'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Checkbox,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
	Skeleton,
} from '@/shared/ui'
import { format } from 'date-fns'
import { useMutation, useQuery } from '@tanstack/react-query'
import { problemsService } from '@/shared/services/problems'
import { useSearchParams } from 'next/navigation'
import { convertToUTC, createPageURL } from '@/shared/lib'
import { contestService } from '@/shared/services/contests'
import { toast } from 'sonner'
import { Info, Loader2 } from 'lucide-react'
import { ProblemDetailsModal } from '../ProblemDetailsModal'

export const CreateContestPage = () => {
	const form = useForm<CreateContestFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			description: '',
			startTime: '',
			endTime: '',
			problemIds: [],
		},
	})

	const searchParams = useSearchParams()

	const page = Number(searchParams.get('page')) || 1
	const pageSize = Number(searchParams.get('pageSize')) || 5

	const { data, isSuccess, isLoading } = useQuery({
		queryKey: ['get-problems', page, pageSize],
		queryFn: () => problemsService.getProblems(page, pageSize),
	})

	const handleProblemSelect = (problemId: string) => {
		const currentProblemIds = form.getValues().problemIds

		if (currentProblemIds.includes(problemId)) {
			const filteredProblemIds = currentProblemIds.filter(
				id => id !== problemId
			) as [string, ...string[]]

			form.setValue('problemIds', filteredProblemIds)
		} else {
			form.setValue('problemIds', [...currentProblemIds, problemId])
		}
	}

	const { mutate, isPending } = useMutation({
		mutationKey: ['create-contest'],
		mutationFn: (dto: CreateContestFormValues) =>
			contestService.createContest(dto),
		onSuccess: () => {
			toast.success('Соревнование успешно создано!')
			form.reset()
		},
	})

	const onSubmit = (data: CreateContestFormValues) => {
		mutate({
			...data,
			startTime: convertToUTC(data.startTime),
			endTime: convertToUTC(data.endTime),
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
				<Card className="max-h-[800px]">
					<CardHeader>
						<CardTitle>Создание соревнования</CardTitle>
						<CardDescription>
							Заполните данные для создания нового соревнования
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 overflow-y-auto">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Название соревнования</FormLabel>
									<FormControl>
										<Input
											placeholder="Введите название соревнования"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Описание соревнования</FormLabel>
									<FormControl>
										<Input
											placeholder="Введите описание соревнования"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="startTime"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Дата и время начала</FormLabel>
									<FormControl>
										<Input
											type="datetime-local"
											min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
											className="w-fit"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="endTime"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Дата и время окончания</FormLabel>
									<FormControl>
										<Input
											type="datetime-local"
											min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
											className="w-fit"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{isLoading && (
							<Skeleton className="w-full h-[276px] rounded-[14px]" />
						)}
						{isSuccess && (
							<Card className="flex flex-col gap-1 justify-start">
								<CardHeader>
									<CardTitle>Выберите задачи</CardTitle>
								</CardHeader>
								<CardContent>
									<FormField
										control={form.control}
										name="problemIds"
										render={() => (
											<FormItem>
												<FormControl>
													{!!data.total ? (
														<div className="space-y-2">
															{data.problems.map(problem => (
																<div
																	key={problem.problemId}
																	className="flex items-center gap-3 h-9"
																>
																	<Checkbox
																		id={problem.problemId}
																		checked={form
																			.watch('problemIds')
																			.includes(problem.problemId)}
																		onCheckedChange={() =>
																			handleProblemSelect(problem.problemId)
																		}
																	/>
																	<label htmlFor={problem.problemId}>
																		{problem.title}
																	</label>
																	<ProblemDetailsModal problem={problem}>
																		<Button
																			type="button"
																			variant={'ghost'}
																			size={'icon'}
																		>
																			<Info />
																		</Button>
																	</ProblemDetailsModal>
																</div>
															))}
														</div>
													) : (
														<p>Задачи не найдены</p>
													)}
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
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
															page <= 1
																? 'pointer-events-none opacity-50'
																: undefined
														}
													/>
												</PaginationItem>
												<PaginationItem>
													<PaginationNext
														href={createPageURL(page + 1)}
														aria-disabled={
															page === Math.ceil(data.total / pageSize)
														}
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
					</CardContent>
					<CardFooter>
						<Button type="submit" disabled={isPending}>
							{isPending && <Loader2 className="animate-spin mr-2" />}
							Создать соревнование
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	)
}
