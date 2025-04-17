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
