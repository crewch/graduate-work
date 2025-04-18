import { authApi } from '@/shared/api'
import { CreateProblemDto, GetProblemsResponseDto } from './types'

class ProblemsService {
	private BASE_URL = '/problems'

	async createProblem(dto: CreateProblemDto) {
		await authApi.post(this.BASE_URL, dto)
	}

	async getProblems(page: number = 1, pageSize: number = 10) {
		const { data } = await authApi.get<GetProblemsResponseDto>(this.BASE_URL, {
			params: {
				page,
				pageSize,
			},
		})

		return data
	}

	async deleteProblem(problemId: string) {
		await authApi.delete(`${this.BASE_URL}/${problemId}`)
	}
}

export const problemsService = new ProblemsService()
