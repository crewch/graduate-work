import { authApi } from '@/shared/api'
import {
	CreateContestDto,
	GetContestProblemsResponseDto,
	GetContestsResponseDto,
} from './types'
import { Contest } from '@/shared/model/prisma-types'

class ContestService {
	private BASE_URL = '/contests'

	async createContest(dto: CreateContestDto) {
		const { data } = await authApi.post<Contest>(this.BASE_URL, dto)

		return data
	}

	async getContest(contestId: string) {
		const { data } = await authApi.get<Contest>(`${this.BASE_URL}/${contestId}`)

		return data
	}

	async getContests(page: number = 1, pageSize: number = 20) {
		const { data } = await authApi.get<GetContestsResponseDto>(this.BASE_URL, {
			params: {
				page,
				pageSize,
			},
		})

		return data
	}

	async registerContest(contestId: string) {
		await authApi.post(`${this.BASE_URL}/${contestId}/register`)
	}

	async getContestProblems(contestId: string) {
		const { data } = await authApi.get<GetContestProblemsResponseDto[]>(
			`${this.BASE_URL}/${contestId}/problems`
		)

		return data
	}

	async getContestProblem(contestId: string, problemId: string) {
		const { data } = await authApi.get<GetContestProblemsResponseDto>(
			`${this.BASE_URL}/${contestId}/problems/${problemId}`
		)

		return data
	}
}

export const contestService = new ContestService()
