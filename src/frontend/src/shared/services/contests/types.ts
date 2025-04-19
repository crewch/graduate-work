import {
	Contest,
	ContestProblem,
	ContestStanding,
	Problem,
	ProblemSample,
	User,
} from '@/shared/model/prisma-types'

export interface CreateContestDto {
	title: string
	description: string
	startTime: string
	endTime: string
	problemIds: string[]
}

export interface GetContestsResponseDto {
	contests: (Contest & { creator: User })[]
	total: number
}

export interface Standing extends ContestStanding {
	problemId: string
	problemIndex: string
	user: User
}

export interface ProblemResponseDto extends Problem {
	samples: ProblemSample[]
	isSolved: boolean
}

export interface GetContestProblemsResponseDto extends ContestProblem {
	problem: ProblemResponseDto
}
