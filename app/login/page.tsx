'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
    const router = useRouter()
    const [shopDomain, setShopDomain] = useState('')
    const [accessToken, setAccessToken] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shop_domain: shopDomain,
                    access_token: accessToken,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Login failed')
            }

            setSuccess(true)
            toast.success('Welcome back! Redirecting to dashboard...')

            // Redirect to dashboard after a brief delay
            setTimeout(() => {
                router.push('/')
                router.refresh()
            }, 1000)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-surface-base flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        AION
                    </h1>
                    <p className="text-text-muted text-sm">
                        Connect your Shopify store to get started
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-surface-main rounded-2xl shadow-lg border border-border-subtle p-8">
                    <h2 className="text-xl font-semibold text-text-primary mb-6">
                        Login to Dashboard
                    </h2>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Shop Domain */}
                        <div>
                            <label
                                htmlFor="shopDomain"
                                className="block text-sm font-medium text-text-secondary mb-2"
                            >
                                Shop Domain
                            </label>
                            <input
                                id="shopDomain"
                                type="text"
                                value={shopDomain}
                                onChange={(e) => setShopDomain(e.target.value)}
                                placeholder="your-store.myshopify.com"
                                className="w-full px-4 py-3 bg-surface-base border border-border-subtle rounded-xl text-text-primary placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* Access Token */}
                        <div>
                            <label
                                htmlFor="accessToken"
                                className="block text-sm font-medium text-text-secondary mb-2"
                            >
                                Access Token
                            </label>
                            <input
                                id="accessToken"
                                type="password"
                                value={accessToken}
                                onChange={(e) => setAccessToken(e.target.value)}
                                placeholder="shpat_xxxxxxxxxxxxx"
                                className="w-full px-4 py-3 bg-surface-base border border-border-subtle rounded-xl text-text-primary placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all"
                                required
                                disabled={isLoading}
                            />
                            <p className="mt-2 text-xs text-text-subtle">
                                Get your access token from Shopify Admin → Apps → Develop apps
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 p-4 bg-status-dangerLight border border-status-danger rounded-xl">
                                <AlertCircle className="w-4 h-4 text-status-danger flex-shrink-0" />
                                <p className="text-sm text-status-danger">{error}</p>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="flex items-center gap-2 p-4 bg-status-successLight border border-status-success rounded-xl">
                                <CheckCircle2 className="w-4 h-4 text-status-success flex-shrink-0" />
                                <p className="text-sm text-status-success">
                                    Login successful! Redirecting...
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || success}
                            className="w-full bg-accent-primary hover:bg-accent-hover text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Connect Store
                                </>
                            )}
                        </button>
                    </form>

                    {/* Help Text */}
                    <div className="mt-6 pt-6 border-t border-border-subtle">
                        <p className="text-xs text-text-muted text-center">
                            Need help?{' '}
                            <a
                                href="https://help.shopify.com/en/manual/apps/app-types/custom-apps"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent-primary hover:underline"
                            >
                                Learn how to create a Shopify custom app
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-text-subtle mt-6">
                    Your credentials are encrypted and stored securely
                </p>
            </div>
        </div>
    )
}
