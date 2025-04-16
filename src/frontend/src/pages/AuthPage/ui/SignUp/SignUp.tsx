'use client'

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
import { z } from 'zod'

const formSchema = z.object({
	username: z
		.string()
		.min(3, {
			message: 'Строка должна содержать не менее 3 символов',
		})
		.max(16, {
			message: 'Строка должна содержать не более 16 символов',
		}),
	email: z.string().email({
		message: 'Неверный адрес электронной почты',
	}),
	password: z
		.string()
		.min(6, { message: 'Строка должна содержать не менее 6 символов' })
		.max(50, {
			message: 'Строка должна содержать не более 50 символов',
		}),
})

export const SignUp = () => {
	const form = useForm<z.infer<typeof formSchema>>({
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
			push('/i')
		},
		onError: (e: AxiosError<Error>) => {
			toast.error('Ошибка регистрации', {
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
