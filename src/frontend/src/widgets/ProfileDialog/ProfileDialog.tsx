'use client'

import { userService } from '@/shared/services/users'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui'
import { useQuery } from '@tanstack/react-query'
import React, { PropsWithChildren } from 'react'

export const ProfileDialog = ({ children }: PropsWithChildren) => {
	const { data, isSuccess } = useQuery({
		queryKey: ['profile'],
		queryFn: () => userService.getProfile(),
	})

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="w-[500px]">
				<DialogHeader>
					<DialogTitle>Профиль</DialogTitle>
				</DialogHeader>
				{isSuccess && (
					<div className="grid grid-cols-2 gap-2">
						<p>Имя пользователя</p>
						<p>{data.username}</p>
						<p>Почта</p>
						<p>{data.email}</p>
						<p>Рейтинг</p>
						<p>{data.rating}</p>
						<p>Время создания</p>
						<p> {new Date(data.createdAt).toLocaleString()}</p>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
