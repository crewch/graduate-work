import {
	SendSubmissionDto,
	submissionsService,
} from '@/shared/services/submissions'
import {
	Button,
	Card,
	CardContent,
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { FC, PropsWithChildren } from 'react'
import { toast } from 'sonner'
import { formSchema, SendSubmissionFormValues } from './types'
import { useForm } from 'react-hook-form'
import { ProgrammingLanguage } from '@/shared/model/prisma-types'
import Editor from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { AxiosError } from 'axios'

interface SendSubmissionDialogProps {
	contestId: string
	problemId: string
}

export const SendSubmissionDialog: FC<
	PropsWithChildren<SendSubmissionDialogProps>
> = ({ children, contestId, problemId }) => {
	const { resolvedTheme } = useTheme()

	const form = useForm<SendSubmissionFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			language: ProgrammingLanguage.PYTHON,
			code: '',
		},
	})

	const { mutate } = useMutation({
		mutationKey: ['send-submission'],
		mutationFn: (dto: SendSubmissionDto) =>
			submissionsService.sendSubmission(dto),
		onSuccess: () => {
			toast.success('Решение успешно отправлено')
		},
		onError: (e: AxiosError<Error>) => {
			toast.error('Произошла ошибка, решение не отправлено', {
				description: e.response?.data.message,
			})
		},
	})

	const onSubmit = (data: SendSubmissionFormValues) => {
		const dto: SendSubmissionDto = {
			contestId,
			problemId,
			...data,
		}

		mutate(dto)
	}

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent onCloseAutoFocus={() => form.reset()}>
				<DialogHeader>
					<DialogTitle>Отправить задачу на проверку</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4 max-h-[700px] overflow-y-auto p-1"
					>
						<FormField
							control={form.control}
							name="language"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Язык</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Выберите язык" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem
												value={ProgrammingLanguage.PYTHON}
												className="hover:bg-accent"
											>
												Python
											</SelectItem>
											<SelectItem
												value={ProgrammingLanguage.JAVASCRIPT}
												className="hover:bg-accent"
											>
												JavaScript
											</SelectItem>
										</SelectContent>
									</Select>
									<FormDescription>Выберите язык</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Card>
							<CardContent>
								<FormField
									control={form.control}
									name="code"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Код</FormLabel>
											<FormControl>
												<Editor
													value={field.value}
													onChange={value => field.onChange(value || '')}
													height="400px"
													language={form.watch('language').toLowerCase()}
													theme={`vs-${resolvedTheme}`}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>
						<DialogFooter>
							<DialogClose asChild>
								<Button
									type="submit"
									disabled={!form.watch('code').trim().length}
								>
									Отправить
								</Button>
							</DialogClose>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
