'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'

interface AuthenticatedLayoutProps {
    children: React.ReactNode
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function initializeSession() {
            try {
                // Check session
                const response = await fetch('/api/auth/session')
                const session = await response.json()

                if (!session.isLoggedIn) {
                    router.push('/login')
                    return
                }

                // Set credentials in API client
                apiClient.setCredentials(
                    session.shopDomain,
                    session.accessToken
                )

                setIsLoading(false)
            } catch (err) {
                setError('Failed to initialize session')
                setIsLoading(false)
            }
        }

        initializeSession()
    }, [router])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-surface-base flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-muted">Loading...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-surface-base flex items-center justify-center">
                <div className="text-center">
                    <p className="text-status-danger font-medium">{error}</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
