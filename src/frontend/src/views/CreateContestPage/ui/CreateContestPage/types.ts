import { z } from 'zod'

export const formSchema = z
	.object({
		title: z.string().nonempty('Название соревнования обязательно'),
		description: z.string().nonempty('Описание соревнования обязательно'),
		startTime: z
			.string()
			.refine(
				value => !isNaN(Date.parse(value)),
				'Неверный формат даты и времени'
			),
		endTime: z
			.string()
			.refine(
				value => !isNaN(Date.parse(value)),
				'Неверный формат даты и времени'
			),
		problemIds: z
			.array(z.string().nonempty('ID задачи не может быть пустым'))
			.nonempty('Список задач не может быть пустым'),
	})
	.refine(
		data => {
			const start = new Date(data.startTime)
			const end = new Date(data.endTime)

			return start < end
		},
		{
			message: 'Дата и время окончания должны быть позже даты и времени начала',
			path: ['endTime'],
		}
	)

export type CreateContestFormValues = z.infer<typeof formSchema>
