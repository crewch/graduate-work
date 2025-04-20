import { ProblemResponseDto } from '@/shared/services/problems'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui'
import { format } from 'date-fns'
import { FC, PropsWithChildren } from 'react'

interface ProblemDetailsModalProps {
	problem: ProblemResponseDto
}

export const ProblemDetailsModal: FC<
	PropsWithChildren<ProblemDetailsModalProps>
> = ({ problem, children }) => {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="w-[1000px]">
				<DialogHeader>
					<DialogTitle>{problem.title}</DialogTitle>
					<DialogDescription>Подробная информация о задаче</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 max-h-[700px] overflow-y-auto p-2">
					<div>
						<h3 className="font-medium text-sm text-muted-foreground mb-1">
							Описание
						</h3>
						<p className="text-sm">{problem.description}</p>
					</div>
					<div>
						<h3 className="font-medium text-sm text-muted-foreground mb-1">
							Форматы данных
						</h3>
						<div className="space-y-2">
							<p className="text-sm">
								<span className="font-semibold">Ввод:</span>{' '}
								{problem.inputFormat || 'Не указано'}
							</p>
							<p className="text-sm">
								<span className="font-semibold">Вывод:</span>{' '}
								{problem.outputFormat || 'Не указано'}
							</p>
						</div>
					</div>
					<div>
						<h3 className="font-medium text-sm text-muted-foreground mb-1">
							Ограничения
						</h3>
						<div className="space-y-2">
							<p className="text-sm">
								<span className="font-semibold">Время:</span>{' '}
								{problem.timeLimit} мс
							</p>
							<p className="text-sm">
								<span className="font-semibold">Память:</span>{' '}
								{problem.memoryLimit} КБ
							</p>
						</div>
					</div>
					{problem.samples && problem.samples.length > 0 && (
						<div>
							<h3 className="font-medium text-sm text-muted-foreground mb-1">
								Примеры
							</h3>
							<div className="space-y-2">
								{problem.samples.map((sample, index) => (
									<div key={index} className="border p-2 rounded-md space-y-1">
										<p className="text-xs font-semibold">Пример {index + 1}</p>
										<p className="text-sm">
											<span className="font-semibold">Ввод:</span>{' '}
											{sample.input}
										</p>
										<p className="text-sm">
											<span className="font-semibold">Вывод:</span>{' '}
											{sample.output}
										</p>
										{sample.explanation && (
											<p className="text-sm">
												<span className="font-semibold">Пояснение:</span>{' '}
												{sample.explanation}
											</p>
										)}
									</div>
								))}
							</div>
						</div>
					)}
					<div>
						<h3 className="font-medium text-sm text-muted-foreground mb-1">
							Метаданные
						</h3>
						<div className="space-y-2">
							<p className="text-sm">
								<span className="font-semibold">Дата создания:</span>{' '}
								{problem.createdAt
									? format(
											new Date(problem.createdAt),
											'dd MMMM yyyy, HH:mm:ss'
									  )
									: 'Не указано'}
							</p>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
