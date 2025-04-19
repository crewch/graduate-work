import { FC } from 'react'
import { CheckCircle2, Circle } from 'lucide-react'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './tooltip'

interface ProblemStatusProps {
	isSolved: boolean
}

export const ProblemStatus: FC<ProblemStatusProps> = ({ isSolved }) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					{isSolved ? <CheckCircle2 /> : <Circle />}
				</TooltipTrigger>
				<TooltipContent>
					{isSolved ? <p>Задача решена</p> : <p>Задача не решена</p>}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
