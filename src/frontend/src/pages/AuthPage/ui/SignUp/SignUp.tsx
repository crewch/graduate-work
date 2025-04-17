'use client'

import { DASHBOARD_PAGES } from '@/shared/config/pages-url.config'
import { authService, SignUpDto } from '@/shared/services/auth'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	Input,
	CardFooter,
	Button,
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/shared/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { formSchema, SignUpFormValues } from './types'

export const SignUp = () => {
	const form = useForm<SignUpFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: '',
			email: '',
			password: '',
		},
	})

	const { push } = useRouter()

	const { mutate, isPending } = useMutation({
		mutationKey: ['sign-up'],
		mutationFn: (data: SignUpDto) => authService.signUp(data),
		onSuccess: () => {
			toast.success('Успешная регистрация!')
			form.reset()
			push(DASHBOARD_PAGES.CONTESTS)
		},
		onError: (e: AxiosError<Error>) => {
			toast.error('Ошибка регистрации', {
				description: e.response?.data.message,
			})
			form.reset()
		},
	})

	const onSubmit = (values: SignUpFormValues) => {
		mutate(values)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Card>
					<CardHeader>
						<CardTitle>Создать аккаунт</CardTitle>
						<CardDescription>
							Введите данные для регистрации нового пользователя
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<FormField
							control={form.control}
							name="username"
							disabled={isPending}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Имя пользователя</FormLabel>
									<FormControl>
										<Input placeholder="Иван Иванов" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							disabled={isPending}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="user@example.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							disabled={isPending}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Пароль</FormLabel>
									<FormControl>
										<Input placeholder="••••••••" type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter>
						<Button type="submit" disabled={isPending}>
							{isPending ? (
								<>
									<Loader2 className="animate-spin" />
									Пожалуйста подождите
								</>
							) : (
								'Зарегистрироваться'
							)}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	)
}
