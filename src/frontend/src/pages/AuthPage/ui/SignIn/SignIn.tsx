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
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { AxiosError } from 'axios'

const formSchema = z.object({
	login: z
		.string()
		.min(3, {
			message: 'Строка должна содержать не менее 3 символов',
		})
		.max(256, {
			message: 'Строка должна содержать не более 256 символов',
		}),
	password: z
		.string()
		.min(6, { message: 'Строка должна содержать не менее 6 символов' })
		.max(50, {
			message: 'Строка должна содержать не более 50 символов',
		}),
})

export const SignIn = () => {
	const form = useForm<z.infer<typeof formSchema>>({
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
			push('/i')
		},
		onError: (e: AxiosError<Error>) => {
			toast.error('Ошибка входа', {
				description: e.response?.data.message,
				duration: 3000,
			})
			form.reset()
		},
	})

	const onSubmit = (values: z.infer<typeof formSchema>) => {
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
