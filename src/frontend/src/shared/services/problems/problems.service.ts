import { authApi } from '@/shared/api'
import { CreateProblemDto } from './types'

class ProblemsService {
	private BASE_URL = '/problems'

	async createProblem(dto: CreateProblemDto) {
		await authApi.post(`${this.BASE_URL}`, dto)
	}

	async deleteProblem(problemId: string) {
		await authApi.delete(`${this.BASE_URL}/${problemId}`)
	}
}

export const problemsService = new ProblemsService()
