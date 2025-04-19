import { AuthPage } from '@/views/AuthPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Войти',
}

export default function Auth() {
	return <AuthPage />
}
