import { NextRequest, NextResponse } from 'next/server'
import { EnumTokens } from './shared/services/auth-token'

export async function middleware(request: NextRequest) {
	const { url, cookies, nextUrl } = request

	const refreshToken = cookies.get(EnumTokens.REFRESH_TOKEN)?.value
	const isAuthPage = url.includes('/auth')
	const isHomePage = nextUrl.pathname === '/'

	if (isHomePage) {
		return NextResponse.redirect(new URL('/auth', url))
	}

	if (isAuthPage && refreshToken) {
		return NextResponse.redirect(new URL('/i', url))
	}

	if (isAuthPage) {
		return NextResponse.next()
	}

	if (!refreshToken) {
		return NextResponse.redirect(new URL('/auth', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/i/:path*', '/auth/:path*', '/'],
}
