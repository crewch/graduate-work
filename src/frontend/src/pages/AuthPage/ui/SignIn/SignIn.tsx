'use client'

import { authService, SignInDto } from '@/shared/services/auth'
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
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/shared/ui'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { AxiosError } from 'axios'
import { DASHBOARD_PAGES } from '@/shared/config/pages-url.config'
import { formSchema, SignInFormValues } from './types'

export const SignIn = () => {
	const form = useForm<SignInFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			login: '',
			password: '',
		},
	})

	const { push } = useRouter()

	const { mutate, isPending } = useMutation({
		mutationKey: ['sign-in'],
		mutationFn: (data: SignInDto) => authService.signIn(data),
		onSuccess: () => {
			toast.success('Успешный вход в систему!')
			form.reset()
			push(DASHBOARD_PAGES.CONTESTS)
		},
		onError: (e: AxiosError<Error>) => {
			toast.error('Ошибка входа', {
				description: e.response?.data.message,
			})
			form.reset()
		},
	})

	const onSubmit = (values: SignInFormValues) => {
		mutate(values)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Card>
					<CardHeader>
						<CardTitle>Авторизация</CardTitle>
						<CardDescription>
							Введите данные для входа в ваш аккаунт
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<FormField
							control={form.control}
							name="login"
							disabled={isPending}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Логин или email</FormLabel>
									<FormControl>
										<Input
											autoFocus
											placeholder="user@example.com"
											{...field}
										/>
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
								'Войти в аккаунт'
							)}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	)
}
