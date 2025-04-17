import { z } from 'zod'

export const formSchema = z.object({
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

export type SignInFormValues = z.infer<typeof formSchema>
