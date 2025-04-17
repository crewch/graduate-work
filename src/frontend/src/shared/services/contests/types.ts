import { User } from '../users/types'

export interface Contest {
	contestId: string
	title: string
	description: string
	startTime: string
	endTime: string
	status: string
	createdBy: string
	updatedAt: string
	createdAt: string
}

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

export interface Standing {
	contestId: string
	problemId: string
	problemIndex: string
	penalty: number
	problemsSolved: number
	rank: number
	userId: string
	user: User
}

export interface Problem {
	contestId: string
	problemId: string
	problemIndex: string
}

export interface GetContestResponseDto {
	contestId: string
	title: string
	description: string
	startTime: string
	endTime: string
	status: string
	createdBy: string
	updatedAt: string
	createdAt: string
	problems: Problem[]
	standings: Standing[]
}
