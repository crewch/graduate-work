import {
	ProgrammingLanguage,
	Submission,
	SubmissionResult,
} from '@/shared/model/prisma-types'

export interface SendSubmissionDto {
	contestId: string
	problemId: string
	language: ProgrammingLanguage
	code: string
}

export interface GetSubmissionResponseDto extends Submission {
	lastResult: SubmissionResult
}
