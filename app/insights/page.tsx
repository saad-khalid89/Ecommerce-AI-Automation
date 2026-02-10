'use client'

import React, { useMemo, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { apiClient } from '@/lib/api-client'

const generateForecastData = () => {
    const today = new Date()
    const currentDay = today.getDate()
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

    const data = []
    for (let day = 1; day <= daysInMonth; day++) {
        const isPast = day <= currentDay
        const baseRevenue = 35000 + Math.random() * 15000
        const trend = day * 800

        data.push({
            day: `${day}`,
            actual: isPast ? baseRevenue + trend + (Math.random() - 0.5) * 8000 : null,
            predicted: !isPast ? baseRevenue + trend + (Math.random() - 0.5) * 5000 : null,
        })
    }
    return data
}

const generateCODRiskData = () => {
    const data = []
    for (let day = 1; day <= 30; day++) {
        const isPast = day <= new Date().getDate()
        const baseFailures = 8 + Math.random() * 6

        data.push({
            day: `${day}`,
            actual: isPast ? Math.floor(baseFailures + (Math.random() - 0.5) * 4) : null,
            predicted: !isPast ? Math.floor(baseFailures + (Math.random() - 0.5) * 3) : null,
        })
    }
    return data
}

export default function InsightsForecastPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    const forecastData = useMemo(() => generateForecastData(), [])
    const codRiskData = useMemo(() => generateCODRiskData(), [])

    const projectedSales = 1420000
    const salesGrowth = 8
    const projectedCODLoss = 210000
    const codImprovement = -12

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await fetch('/api/auth/session')
                const session = await response.json()

                if (!session.isLoggedIn) {
                    router.push('/login')
                    return
                }

                apiClient.setCredentials(session.shopDomain, session.accessToken)
                setIsLoading(false)
            } catch (err) {
                console.error('Auth check failed:', err)
                router.push('/login')
            }
        }

        checkAuth()
    }, [router])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-accent-500/30 border-t-accent-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-secondary">Loading forecast...</p>
                </div>
            </div>
        )
    }

    const aiInsights = [
        'Karachi deliveries are failing 18% more than usual this week',
        'Product "Winter Jacket Pro" has 22% return rate  highest in catalog',
        'COD confirmation rate dropped from 78% to 71% in last 3 days',
        'Peak order time shifted from 2pm to 4pm  delivery slots may need adjustment',
    ]

    const recommendations = [
        {
            title: 'Send COD Reminder Campaign in Karachi',
            description: 'Target 340 pending orders with SMS confirmation',
            impact: 'PKR 85,000 recovered',
            confidence: 'High',
        },
        {
            title: 'Push Prepaid Discount for High-Return Products',
            description: 'Offer 8% discount on prepaid orders for Winter Jacket Pro',
            impact: 'PKR 45,000 saved',
            confidence: 'Medium',
        },
        {
            title: 'Block Repeat Fake Customers',
            description: '23 phone numbers flagged with 3+ failed COD attempts',
            impact: 'PKR 38,000 saved',
            confidence: 'High',
        },
        {
            title: 'Adjust Delivery Time Windows',
            description: 'Add 4-6pm slot for Karachi, Lahore zones',
            impact: '+12% success rate',
            confidence: 'Medium',
        },
    ]

    return (
        <div className="min-h-screen bg-white flex">
            <Sidebar activePage="Insights" />

            <main className="flex-1 overflow-auto">
                <header className="px-8 py-8 bg-white shadow-sm border-b border-border">
                    <div>
                        <h1 className="text-text-primary text-2xl font-bold tracking-tight">Business Forecast</h1>
                        <p className="text-text-secondary text-sm mt-1.5">AI-powered predictions and recommendations for next 30 days</p>
                    </div>
                </header>

                <div className="px-8 py-8">
                    <div className="grid grid-cols-2 gap-4 mb-6 animate-fade-in-up">
                        <div className="bg-white border border-border rounded-lg p-5 shadow-sm hover:shadow transition-all duration-150 card-hover">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-text-tertiary text-xs font-medium mb-2">
                                        Projected Sales (This Month)
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <h2 className="text-text-primary text-2xl font-semibold tabular-nums">
                                            ${(projectedSales * 0.0036).toFixed(0).toLocaleString()}
                                        </h2>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-text-tertiary" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-status-success">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">+{salesGrowth}% vs last month</span>
                                <span className="text-text-tertiary text-xs">Based on trajectory</span>
                            </div>
                        </div>

                        <div className="bg-white border border-border rounded-lg p-5 shadow-sm hover:shadow transition-all duration-150 card-hover">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-text-tertiary text-xs font-medium mb-2">
                                        Projected COD Loss
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <h2 className="text-text-primary text-2xl font-semibold tabular-nums">
                                            ${(projectedCODLoss * 0.0036).toFixed(0).toLocaleString()}
                                        </h2>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <TrendingDown className="w-4 h-4 text-text-tertiary" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-status-success">
                                <TrendingDown className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">{Math.abs(codImprovement)}% improvement</span>
                                <span className="text-text-tertiary text-xs">AI optimizations working</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-border rounded-lg p-5 shadow-sm hover:shadow transition-all duration-150 card-hover mb-6 animate-fade-in-up">
                        <div className="mb-4">
                            <h3 className="text-text-primary text-sm font-semibold mb-1">Revenue Forecast</h3>
                            <p className="text-text-secondary text-xs">Daily sales - actual vs predicted</p>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={forecastData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                                    <XAxis dataKey="day" stroke="#9CA3AF" style={{ fontSize: '11px' }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#9CA3AF" style={{ fontSize: '11px' }} axisLine={false} tickLine={false} tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '8px 12px', fontSize: '12px' }} formatter={(value: any) => [`$${((value || 0) * 0.0036).toFixed(0).toLocaleString()}`, '']} />
                                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} iconType="line" />
                                    <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2} dot={false} name="Actual Revenue" connectNulls />
                                    <Line type="monotone" dataKey="predicted" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="6 6" dot={false} name="Predicted Revenue" connectNulls />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white border border-border rounded-lg p-5 shadow-sm hover:shadow transition-all duration-150 card-hover mb-6 animate-fade-in-up">
                        <div className="mb-4">
                            <h3 className="text-text-primary text-sm font-semibold mb-1">COD Failure Forecast</h3>
                            <p className="text-text-secondary text-xs">Daily failed deliveries - risk analysis</p>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={codRiskData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                                    <XAxis dataKey="day" stroke="#9CA3AF" style={{ fontSize: '11px' }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#9CA3AF" style={{ fontSize: '11px' }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '8px 12px', fontSize: '12px' }} formatter={(value: any) => [`${value} failures`, '']} />
                                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
                                    <Bar dataKey="actual" fill="#EF4444" radius={[4, 4, 0, 0]} name="Actual Failures" />
                                    <Bar dataKey="predicted" fill="#D1D5DB" radius={[4, 4, 0, 0]} name="Predicted Failures" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
                        <div className="bg-white border border-border rounded-lg p-5 shadow-sm hover:shadow transition-all duration-150 card-hover">
                            <div className="flex items-center gap-2.5 mb-4">
                                <AlertCircle className="w-4 h-4 text-text-tertiary" />
                                <div>
                                    <h3 className="text-text-primary text-sm font-semibold">AION's Analysis</h3>
                                    <p className="text-text-tertiary text-xs">Why these numbers look this way</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {aiInsights.map((insight, index) => (
                                    <div key={index} className="flex items-start gap-2.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-1.5 flex-shrink-0" />
                                        <p className="text-text-secondary text-xs leading-relaxed">{insight}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2.5 mb-3">
                                <CheckCircle2 className="w-4 h-4 text-text-tertiary" />
                                <div>
                                    <h3 className="text-text-primary text-sm font-semibold">Recommended Actions</h3>
                                    <p className="text-text-tertiary text-xs">AI-suggested optimizations</p>
                                </div>
                            </div>

                            {recommendations.map((rec, index) => {
                                const impactMatch = rec.impact.match(/(PKR|\$)\s*([\d,]+)/);
                                const displayImpact = impactMatch
                                    ? `$${(parseInt(impactMatch[2].replace(/,/g, '')) * 0.0036).toFixed(0)}`
                                    : rec.impact;
                                return (
                                    <div key={index} className="bg-white border border-border rounded-lg p-4 shadow-sm hover:shadow transition-all duration-150 card-hover">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h4 className="text-text-primary text-xs font-semibold mb-1">{rec.title}</h4>
                                                <p className="text-text-secondary text-xs leading-relaxed mb-2">{rec.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-accent-600 text-xs font-semibold">{displayImpact}</span>
                                                <span className="text-text-tertiary text-xs">{rec.confidence} confidence</span>
                                            </div>
                                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-medium rounded-lg transition-all duration-150 btn-press">
                                                <span>Apply</span>
                                                <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
