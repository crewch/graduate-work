'use client'

import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Textarea,
} from '@/shared/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { CreateProblemFormValues, formSchema } from './types'
import { v4 as uuidv4 } from 'uuid'
import { useMutation } from '@tanstack/react-query'
import { problemsService } from '@/shared/services/problems'

export const CreateProblemPage = () => {
	const form = useForm<CreateProblemFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			description: '',
			inputFormat: '',
			outputFormat: '',
			timeLimit: 1,
			memoryLimit: 1,
			samples: [{ id: uuidv4(), input: '', output: '' }],
			testCases: [{ id: uuidv4(), input: '', output: '' }],
		},
	})

	const { mutate } = useMutation({
		mutationKey: ['createProblem'],
		mutationFn: (data: CreateProblemFormValues) =>
			problemsService.createProblem(data),
		onSuccess: () => {
			toast.success('Задача успешно создана!')
			form.reset()
		},
	})

	const onSubmit = (data: CreateProblemFormValues) => {
		mutate(data)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
				<Card className="max-h-[800px]">
					<CardHeader>
						<CardTitle>Создание задачи</CardTitle>
						<CardDescription>
							Заполните данные для создания новой задачи
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6 overflow-y-auto">
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Название задачи</FormLabel>
										<FormControl>
											<Input placeholder="Введите название задачи" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="timeLimit"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Лимит времени (мс)</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={e => field.onChange(Number(e.target.value))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="memoryLimit"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Лимит памяти (КБ)</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={e => field.onChange(Number(e.target.value))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Описание задачи</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Подробное описание задачи"
											className="min-h-[100px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="inputFormat"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Формат ввода</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Описание формата входных данных"
												className="resize-none h-[80px]"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="outputFormat"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Формат вывода</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Описание формата выходных данных"
												className="resize-none h-[80px]"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="space-y-4">
							<h3 className="font-medium">Примеры</h3>
							<FormField
								control={form.control}
								name="samples"
								render={() => (
									<div className="space-y-3">
										{form.watch('samples').map((sample, index) => (
											<div
												key={sample.id}
												className="border p-4 rounded-lg space-y-3"
											>
												<FormField
													control={form.control}
													name={`samples.${index}.input`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Ввод {index + 1}</FormLabel>
															<FormControl>
																<Textarea
																	placeholder="Пример входных данных"
																	className="resize-none min-h-[60px]"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`samples.${index}.output`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Вывод {index + 1}</FormLabel>
															<FormControl>
																<Textarea
																	placeholder="Пример выходных данных"
																	className="resize-none min-h-[60px]"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`samples.${index}.explanation`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Пояснение</FormLabel>
															<FormControl>
																<Textarea
																	placeholder="Объяснение примера"
																	className="resize-none min-h-[60px]"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												{form.watch('samples').length > 1 && (
													<Button
														type="button"
														variant={'destructive'}
														onClick={() => {
															const samples = structuredClone(
																form.watch('samples')
															)
															samples.splice(index, 1)

															form.setValue('samples', samples)
														}}
													>
														<X /> Удалить пример
													</Button>
												)}
											</div>
										))}
										<Button
											type="button"
											variant="outline"
											onClick={() =>
												form.setValue('samples', [
													...form.watch('samples'),
													{
														id: uuidv4(),
														input: '',
														output: '',
														explanation: '',
													},
												])
											}
										>
											Добавить пример
										</Button>
									</div>
								)}
							/>
						</div>
						<div className="space-y-4">
							<h3 className="font-medium">Тесты</h3>
							<FormField
								control={form.control}
								name="testCases"
								render={() => (
									<div className="space-y-3">
										{form.watch('testCases').map((testCase, index) => (
											<div
												key={testCase.id}
												className="border p-4 rounded-lg space-y-3"
											>
												<FormField
													control={form.control}
													name={`testCases.${index}.input`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Тест {index + 1} - Ввод</FormLabel>
															<FormControl>
																<Textarea
																	placeholder="Входные данные теста"
																	className="resize-none min-h-[60px]"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`testCases.${index}.output`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Тест {index + 1} - Вывод</FormLabel>
															<FormControl>
																<Textarea
																	placeholder="Ожидаемый вывод теста"
																	className="resize-none min-h-[60px]"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												{form.watch('testCases').length > 1 && (
													<Button
														type="button"
														variant="destructive"
														onClick={() => {
															const testCases = structuredClone(
																form.watch('testCases')
															)
															testCases.splice(index, 1)
															form.setValue('testCases', testCases)
														}}
													>
														<X /> Удалить тест
													</Button>
												)}
											</div>
										))}
										<Button
											type="button"
											variant="outline"
											onClick={() =>
												form.setValue('testCases', [
													...form.watch('testCases'),
													{
														id: uuidv4(),
														input: '',
														output: '',
													},
												])
											}
										>
											Добавить тест-кейс
										</Button>
									</div>
								)}
							/>
						</div>
					</CardContent>
					<CardFooter>
						<Button type="submit" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting && (
								<Loader2 className="animate-spin mr-2" />
							)}
							Создать задачу
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	)
}
