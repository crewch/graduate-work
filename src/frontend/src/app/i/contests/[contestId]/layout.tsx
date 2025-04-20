'use client'

import { PropsWithChildren } from 'react'
import { Button } from '@/shared/ui'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

export default function DashboardLayout({ children }: PropsWithChildren) {
	const pathname = usePathname()
	const { contestId } = useParams()

	return (
		<div className="h-full flex flex-col gap-2">
			<header className="w-full h-10 flex justify-center items-center">
				<Button variant={'link'} asChild>
					<Link
						href={`/i/contests/${contestId}`}
						className={pathname.endsWith(`${contestId}`) ? 'underline' : ''}
					>
						Задачи
					</Link>
				</Button>
				<Button variant={'link'} asChild>
					<Link
						href={`/i/contests/${contestId}/submissions`}
						className={pathname.endsWith('submissions') ? 'underline' : ''}
					>
						Посылки
					</Link>
				</Button>
				<Button variant={'link'} asChild>
					<Link
						href={`/i/contests/${contestId}/rating`}
						className={pathname.endsWith('rating') ? 'underline' : ''}
					>
						Рейтинг
					</Link>
				</Button>
			</header>
			<main className="h-full w-full flex flex-col">{children}</main>
		</div>
	)
}
