'use client'

import React, { PropsWithChildren, useState } from 'react'
import { userService } from '@/shared/services/users'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Skeleton,
} from '@/shared/ui'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'

export const ProfileDialog = ({ children }: PropsWithChildren) => {
	const [open, setOpen] = useState(false)

	const { data, isLoading, isSuccess } = useQuery({
		queryKey: ['get-profile'],
		queryFn: () => userService.getProfile(),
		enabled: open,
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="w-[500px]">
				<DialogHeader>
					<DialogTitle>Профиль</DialogTitle>
				</DialogHeader>
				{isLoading && <Skeleton className="h-[120px]" />}
				{isSuccess && (
					<div className="grid grid-cols-2 gap-2">
						<p>Имя пользователя</p>
						<p>{data.username}</p>
						<p>Почта</p>
						<p>{data.email}</p>
						<p>Рейтинг</p>
						<p>{data.rating}</p>
						<p>Время создания</p>
						<p>{format(new Date(data.createdAt), 'dd MMMM yyyy, HH:mm:ss')}</p>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
