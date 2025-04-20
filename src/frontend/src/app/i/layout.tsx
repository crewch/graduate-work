'use client'

import { PropsWithChildren } from 'react'
import { DASHBOARD_PAGES } from '@/shared/config/pages-url.config'
import { Button, ModeToggle, Separator } from '@/shared/ui'
import Image from 'next/image'
import Link from 'next/link'
import logoPic from '../favicon.ico'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, UserCircle2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/shared/services/auth'
import { toast } from 'sonner'
import { ProfileDialog } from '@/widgets/ProfileDialog'

export default function DashboardLayout({ children }: PropsWithChildren) {
	const pathname = usePathname()

	const { push } = useRouter()

	const { mutate } = useMutation({
		mutationKey: ['log-out'],
		mutationFn: () => authService.signOut(),
		onSuccess: () => {
			toast.success('Вы успешно вышли')
			push('/auth')
		},
	})

	return (
		<div className="h-screen py-2 flex flex-col items-center gap-2">
			<header className="w-3/4 h-14 flex justify-between items-center">
				<div className="h-full flex justify-between items-center gap-2">
					<Image src={logoPic} alt={'Логотип'} width={36} />
					<Button variant={'link'} asChild>
						<Link
							href={DASHBOARD_PAGES.CONTESTS}
							className={
								pathname === DASHBOARD_PAGES.CONTESTS ? 'underline' : ''
							}
						>
							Соревнования
						</Link>
					</Button>
					<Button variant={'link'} asChild>
						<Link
							href={DASHBOARD_PAGES.LEADERBOARDS}
							className={
								pathname === DASHBOARD_PAGES.LEADERBOARDS ? 'underline' : ''
							}
						>
							Таблица лидеров
						</Link>
					</Button>
					<Button variant={'link'} asChild>
						<Link
							href={DASHBOARD_PAGES.CREATE_CONTEST}
							className={
								pathname === DASHBOARD_PAGES.CREATE_CONTEST ? 'underline' : ''
							}
						>
							Создать соревнование
						</Link>
					</Button>
					<Button variant={'link'} asChild>
						<Link
							href={DASHBOARD_PAGES.CREATE_PROBLEM}
							className={
								pathname === DASHBOARD_PAGES.CREATE_PROBLEM ? 'underline' : ''
							}
						>
							Создать задачу
						</Link>
					</Button>
				</div>
				<div className="flex gap-2">
					<ModeToggle />
					<ProfileDialog>
						<Button variant="outline" size={'icon'}>
							<UserCircle2 />
						</Button>
					</ProfileDialog>
					<Button variant="outline" size={'icon'} onClick={() => mutate()}>
						<LogOut />
					</Button>
				</div>
			</header>
			<Separator />
			<main className="h-full w-3/4">{children}</main>
		</div>
	)
}
