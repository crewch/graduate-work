import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from './providers'
import './globals.css'

const font = Inter({
	subsets: ['cyrillic', 'latin'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	display: 'swap',
})

export const metadata: Metadata = {
	title: 'Code Arena',
	description: 'Сервис для проведения соревнований по программированию',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="ru" suppressHydrationWarning>
			<body className={`${font.className} antialiased`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
