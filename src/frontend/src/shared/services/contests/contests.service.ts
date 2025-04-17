import { authApi } from '@/shared/api'
import {
	Contest,
	CreateContestDto,
	GetContestResponseDto,
	GetContestsResponseDto,
} from './types'

class ContestService {
	private BASE_URL = '/contests'

	async createContest(dto: CreateContestDto) {
		const { data } = await authApi.post<Contest>(this.BASE_URL, dto)

		return data
	}

	async getContest(contestId: string) {
		const { data } = await authApi.post<GetContestResponseDto>(
			`${this.BASE_URL}/${contestId}`
		)

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
}

export const contestService = new ContestService()
