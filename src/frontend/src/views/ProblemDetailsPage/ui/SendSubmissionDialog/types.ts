import { ProgrammingLanguage } from '@/shared/model/prisma-types'
import { z } from 'zod'

export const formSchema = z.object({
	language: z.nativeEnum(ProgrammingLanguage),
	code: z.string().nonempty('Код не должен быть пустой'),
})

export type SendSubmissionFormValues = z.infer<typeof formSchema>
