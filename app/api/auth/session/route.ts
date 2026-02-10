/**
 * Check Session API Route
 * Returns current session status
 */

import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export async function GET() {
    try {
        const session = await getSession()

        if (!session.isLoggedIn) {
            return NextResponse.json({
                isLoggedIn: false,
            })
        }

        return NextResponse.json({
            isLoggedIn: true,
            shopDomain: session.shopDomain,
            accessToken: session.accessToken,
            shopName: session.shopName,
            shopEmail: session.shopEmail,
        })
    } catch (error) {
        console.error('Session check error:', error)
        return NextResponse.json(
            { error: 'Failed to check session' },
            { status: 500 }
        )
    }
}
