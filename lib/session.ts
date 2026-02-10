/**
 * Session Management with iron-session
 * Secure encrypted cookie-based session storage
 */

import { getIronSession, IronSession, SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
    isLoggedIn: boolean
    shopDomain?: string
    accessToken?: string
    shopName?: string
    shopEmail?: string
}

const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET as string,
    cookieName: 'shopify_session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
    },
}

/**
 * Get current session
 */
export async function getSession() {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)
    return session
}

/**
 * Save session data
 */
export async function saveSession(data: Partial<SessionData>) {
    const session = await getSession()
    Object.assign(session, data)
    await session.save()
}

/**
 * Destroy session
 */
export async function destroySession() {
    const session = await getSession()
    session.destroy()
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession()
    return session.isLoggedIn === true
}

/**
 * Get credentials from session
 */
export async function getCredentials(): Promise<{
    shopDomain: string
    accessToken: string
} | null> {
    const session = await getSession()

    if (!session.isLoggedIn || !session.shopDomain || !session.accessToken) {
        return null
    }

    return {
        shopDomain: session.shopDomain,
        accessToken: session.accessToken,
    }
}
