import { NextRequest, NextResponse } from 'next/server'
import { EnumTokens } from './shared/services/auth-token'
import { DASHBOARD_PAGES } from './shared/config/pages-url.config'

export async function middleware(request: NextRequest) {
	const { url, cookies, nextUrl } = request

	const refreshToken = cookies.get(EnumTokens.REFRESH_TOKEN)?.value

	if (nextUrl.pathname === '/') {
		if (refreshToken) {
			return NextResponse.redirect(new URL(DASHBOARD_PAGES.CONTESTS, url))
		}

		return NextResponse.redirect(new URL('/auth', url))
	}

	if (nextUrl.pathname.startsWith('/auth')) {
		if (refreshToken) {
			return NextResponse.redirect(new URL(DASHBOARD_PAGES.CONTESTS, url))
		}

		return NextResponse.next()
	}

	if (!refreshToken) {
		return NextResponse.redirect(new URL('/auth', url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/i/:path*', '/auth/:path*', '/'],
}
