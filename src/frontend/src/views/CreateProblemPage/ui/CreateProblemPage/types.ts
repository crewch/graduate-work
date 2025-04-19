import { z } from 'zod'

const SampleSchema = z.object({
	id: z.string().uuid(),
	input: z.string().nonempty('Поле ввода обязательно для заполнения'),
	output: z.string().nonempty('Поле вывода обязательно для заполнения'),
	explanation: z.string().optional(),
})

const TestCaseSchema = z.object({
	id: z.string().uuid(),
	input: z.string().nonempty('Поле ввода обязательно для заполнения'),
	output: z.string().nonempty('Поле вывода обязательно для заполнения'),
})

export const formSchema = z.object({
	title: z.string().nonempty('Название задачи обязательно'),
	description: z.string().nonempty('Описание задачи обязательно'),
	inputFormat: z.string().nonempty('Формат ввода обязателен'),
	outputFormat: z.string().nonempty('Формат вывода обязателен'),
	timeLimit: z
		.number()
		.positive('Лимит времени должен быть положительным числом'),
	memoryLimit: z
		.number()
		.positive('Лимит памяти должен быть положительным числом'),
	samples: z.array(SampleSchema).nonempty('Должен быть хотя бы один пример'),
	testCases: z
		.array(TestCaseSchema)
		.nonempty('Должен быть хотя бы один тест-кейс'),
})

export type CreateProblemFormValues = z.infer<typeof formSchema>
