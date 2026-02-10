/**
 * Login API Route
 * Validates Shopify credentials and creates session
 */

import { NextRequest, NextResponse } from 'next/server'
import { saveSession } from '@/lib/session'
import { validateShopifyCredentials } from '@/lib/api-client'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { shop_domain, access_token } = body

        // Validate input
        if (!shop_domain || !access_token) {
            return NextResponse.json(
                { error: 'Shop domain and access token are required' },
                { status: 400 }
            )
        }

        // Validate credentials with Shopify API
        const result = await validateShopifyCredentials({
            shop_domain,
            access_token,
        })

        if (!result.valid) {
            return NextResponse.json(
                { error: 'Invalid Shopify credentials' },
                { status: 401 }
            )
        }

        // Create session
        await saveSession({
            isLoggedIn: true,
            shopDomain: shop_domain,
            accessToken: access_token,
            shopName: result.shop.name,
            shopEmail: result.shop.email,
        })

        return NextResponse.json({
            success: true,
            shop: result.shop,
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Login failed' },
            { status: 500 }
        )
    }
}
