export interface CreateProblemDto {
	title: string
	description: string
	inputFormat: string
	outputFormat: string
	timeLimit: number
	memoryLimit: number
	samples: Sample[]
	testCases: TestCase[]
}

export interface TestCase {
	input: string
	output: string
}

export interface Sample {
	input: string
	output: string
	explanation?: string
}

export interface ProblemsSample {
	sampleId: string
	problemId: string
	input: string
	output: string
	explanation?: string
}

export interface Problem {
	problemId: string
	title: string
	description: string
	inputFormat: string
	outputFormat: string
	timeLimit: number
	memoryLimit: number
	createdBy: string
	createdAt: string
	updatedAt: string
	samples: ProblemsSample[]
}

export interface GetProblemsResponseDto {
	problems: Problem[]
	total: number
}
