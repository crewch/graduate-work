'use client'

import { PropsWithChildren } from 'react'
import { ThemeProvider, Toaster } from '@/shared/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const Providers = ({ children }: PropsWithChildren) => {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
			<Toaster />
		</ThemeProvider>
	)
}

export default Providers
