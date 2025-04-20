import { SubmissionResult } from '@/shared/model/prisma-types'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui'
import { FC, PropsWithChildren } from 'react'

interface DetailSubmissionDialogProps {
	submissionResult?: SubmissionResult
}

export const DetailSubmissionDialog: FC<
	PropsWithChildren<DetailSubmissionDialogProps>
> = ({ children, submissionResult }) => {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="min-w-[500px] w-fit">
				<DialogHeader>
					<DialogTitle>Детали посылки</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-1 max-h-[700px] overflow-y-auto pr-1">
					<div>
						<p className="text-sm text-muted-foreground">Время выполнения</p>
						<p>{submissionResult?.executionTime ?? 0} мс</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Памяти использовано</p>
						<p>{submissionResult?.memoryUsed ?? 0} КБ</p>
					</div>
					{submissionResult?.errorMessage && (
						<div>
							<p className="text-sm text-muted-foreground">
								Сообщение об ошибке
							</p>
							<pre className="bg-destructive/10 p-2 rounded whitespace-pre-wrap">
								{submissionResult.errorMessage}
							</pre>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}
