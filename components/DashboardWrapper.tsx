'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Dashboard from '@/components/Dashboard'
import { apiClient } from '@/lib/api-client'

export default function DashboardWrapper() {
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
                    <p className="text-text-muted">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-surface-base flex items-center justify-center">
                <div className="text-center">
                    <p className="text-status-danger mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="px-4 py-2 bg-accent-primary text-white rounded-lg"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        )
    }

    return <Dashboard />
}
