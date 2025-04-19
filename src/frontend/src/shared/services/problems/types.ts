import { Problem, ProblemSample, TestCase } from '@/shared/model/prisma-types'

export type CreateTestCase = Pick<TestCase, 'input' | 'output'>

export type CreateSample = Pick<
	ProblemSample,
	'input' | 'output' | 'explanation'
>

export interface CreateProblemDto {
	title: string
	description: string
	inputFormat: string
	outputFormat: string
	timeLimit: number
	memoryLimit: number
	samples: CreateSample[]
	testCases: CreateTestCase[]
}

export interface ProblemResponseDto extends Problem {
	samples: ProblemSample[]
}

export interface GetProblemsResponseDto {
	problems: ProblemResponseDto[]
	total: number
}
