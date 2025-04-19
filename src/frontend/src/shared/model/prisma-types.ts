export const ContestStatus = {
	UPCOMING: 'UPCOMING',
	ONGOING: 'ONGOING',
	FINISHED: 'FINISHED',
} as const

export const ProgrammingLanguage = {
	PYTHON: 'PYTHON',
	JAVASCRIPT: 'JAVASCRIPT',
} as const

export const SubmissionStatus = {
	ACCEPTED: 'ACCEPTED',
	PENDING: 'PENDING',
	FAILED: 'FAILED',
	WRONG_ANSWER: 'WRONG_ANSWER',
	TIME_LIMIT_EXCEEDED: 'TIME_LIMIT_EXCEEDED',
	MEMORY_LIMIT_EXCEEDED: 'MEMORY_LIMIT_EXCEEDED',
} as const

export type ContestStatus = (typeof ContestStatus)[keyof typeof ContestStatus]
export type ProgrammingLanguage =
	(typeof ProgrammingLanguage)[keyof typeof ProgrammingLanguage]
export type SubmissionStatus =
	(typeof SubmissionStatus)[keyof typeof SubmissionStatus]

export interface Contest {
	contestId: string
	title: string
	description: string
	startTime: Date
	endTime: Date
	status: ContestStatus
	createdBy?: string | null
	createdAt: Date
	updatedAt: Date
}

export interface ContestProblem {
	contestId: string
	problemId: string
	problemIndex: string
}

export interface ContestStanding {
	contestId: string
	userId: string
	rank: number
	problemsSolved: number
	penalty: number
}

export interface Problem {
	problemId: string
	title: string
	description: string
	inputFormat: string
	outputFormat: string
	timeLimit: number
	memoryLimit: number
	createdBy?: string | null
	createdAt: Date
	updatedAt: Date
}

export interface User {
	userId: string
	username: string
	email: string
	rating: number
	createdAt: Date
	updatedAt: Date
}

export interface TestCase {
	testId: string
	problemId: string
	input: string
	output: string
}

export interface SubmissionResult {
	submissionId: string
	testId: string
	status: SubmissionStatus
	errorMessage?: string | null
	executionTime?: number | null
	memoryUsed?: number | null
	createdAt: Date
}

export interface Submission {
	submissionId: string
	userId: string
	contestId: string
	problemId: string
	language: ProgrammingLanguage
	code: string
	submissionTime: Date
	verdict: SubmissionStatus
}

export interface ProblemSample {
	sampleId: string
	problemId: string
	input: string
	output: string
	explanation?: string | null
}
