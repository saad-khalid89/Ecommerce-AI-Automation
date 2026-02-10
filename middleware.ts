import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getIronSession } from 'iron-session'
import { SessionData } from './lib/session'

export async function middleware(request: NextRequest) {
    const response = NextResponse.next()

    // Get session
    const session = await getIronSession<SessionData>(
        request,
        response,
        {
            password: process.env.SESSION_SECRET as string,
            cookieName: 'shopify_session',
        }
    )

    // Protect dashboard routes
    if (request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!session.isLoggedIn) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // Redirect to dashboard if already logged in and trying to access login
    if (request.nextUrl.pathname === '/login' && session.isLoggedIn) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return response
}

export const config = {
    matcher: ['/', '/dashboard/:path*', '/login'],
}
