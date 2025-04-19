import { authApi } from '@/shared/api'
import { GetSubmissionResponseDto, SendSubmissionDto } from './type'

class SubmissionsService {
	private BASE_URL = '/submissions'

	async sendSubmission(dto: SendSubmissionDto) {
		await authApi.post(this.BASE_URL, dto)
	}

	async getSubmissions(contestId: string) {
		const { data } = await authApi.get<GetSubmissionResponseDto[]>(
			`${this.BASE_URL}/${contestId}`
		)

		return data
	}
}

export const submissionsService = new SubmissionsService()
