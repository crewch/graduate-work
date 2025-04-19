import { z } from 'zod'

export const formSchema = z.object({
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

export type SignUpFormValues = z.infer<typeof formSchema>
