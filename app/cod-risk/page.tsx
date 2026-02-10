'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'
import { Shield, AlertTriangle, TrendingDown, Ban, CheckCircle, XCircle, Clock } from 'lucide-react'

interface RiskOrder {
    id: string
    orderNumber: string
    customer: string
    amount: string
    riskScore: number
    reason: string
    aiAction: string
    status: 'blocked' | 'flagged' | 'approved'
    date: string
}

const mockRiskOrders: RiskOrder[] = [
    { id: '1', orderNumber: '#3421', customer: 'Unknown User', amount: 'PKR 45,000', riskScore: 2.1, reason: 'Suspicious phone number pattern', aiAction: 'Blocked automatically', status: 'blocked', date: '2 hours ago' },
    { id: '2', orderNumber: '#3418', customer: 'Fake Store XYZ', amount: 'PKR 38,500', riskScore: 3.4, reason: 'Multiple orders from same IP', aiAction: 'Blocked automatically', status: 'blocked', date: '4 hours ago' },
    { id: '3', orderNumber: '#3415', customer: 'Ali Hassan', amount: 'PKR 12,300', riskScore: 5.8, reason: 'First-time customer, high value', aiAction: 'Flagged for review', status: 'flagged', date: '6 hours ago' },
    { id: '4', orderNumber: '#3410', customer: 'Test Account', amount: 'PKR 28,900', riskScore: 1.9, reason: 'Email contains "test"', aiAction: 'Blocked automatically', status: 'blocked', date: '8 hours ago' },
    { id: '5', orderNumber: '#3407', customer: 'Sara Malik', amount: 'PKR 15,600', riskScore: 6.2, reason: 'Unusual delivery address', aiAction: 'Approved after verification', status: 'approved', date: '10 hours ago' },
]

function AIRiskContent() {
    const [filter, setFilter] = useState<'all' | 'blocked' | 'flagged' | 'approved'>('all')

    const filteredOrders = filter === 'all'
        ? mockRiskOrders
        : mockRiskOrders.filter(o => o.status === filter)

    const totalAtRisk = mockRiskOrders
        .filter(o => o.status === 'blocked' || o.status === 'flagged')
        .reduce((sum, o) => sum + parseFloat(o.amount.replace('PKR ', '').replace(',', '')), 0)

    const blockedCount = mockRiskOrders.filter(o => o.status === 'blocked').length
    const flaggedCount = mockRiskOrders.filter(o => o.status === 'flagged').length

    return (
        <div className="min-h-screen bg-white flex">
            <Sidebar activePage="COD & Risk" />

            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="px-8 py-8 bg-white shadow-sm border-b border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-text-primary text-2xl font-bold tracking-tight">
                                AI Risk Center
                            </h1>
                            <p className="text-text-secondary text-sm mt-1.5">
                                AI-powered fraud detection protecting your revenue
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-status-success">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">AI Protection Active</span>
                        </div>
                    </div>
                </header>

                <div className="px-8 py-8">
                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-6 animate-fade-in-up">
                        <div className="bg-white border border-status-danger/20 p-5 rounded-lg shadow-sm hover:shadow transition-all duration-150 card-hover">
                            <div className="flex items-center gap-2.5 mb-3">
                                <AlertTriangle className="w-4 h-4 text-status-danger" />
                                <p className="text-text-tertiary text-xs font-medium">Money at Risk</p>
                            </div>
                            <p className="text-text-primary text-2xl font-semibold mb-1 tabular-nums">${(totalAtRisk * 0.0036).toFixed(0).toLocaleString()}</p>
                            <p className="text-text-secondary text-xs">Across {blockedCount + flaggedCount} orders</p>
                        </div>

                        <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow transition-all duration-150 card-hover border border-border">
                            <div className="flex items-center gap-2.5 mb-3">
                                <Ban className="w-4 h-4 text-text-tertiary" />
                                <p className="text-text-tertiary text-xs font-medium">Blocked Today</p>
                            </div>
                            <p className="text-text-primary text-2xl font-semibold mb-1 tabular-nums">{blockedCount}</p>
                            <p className="text-status-danger text-xs font-medium">Saved ${(112400 * 0.0036).toFixed(0)}</p>
                        </div>

                        <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow transition-all duration-150 card-hover border border-border">
                            <div className="flex items-center gap-2.5 mb-3">
                                <AlertTriangle className="w-4 h-4 text-text-tertiary" />
                                <p className="text-text-tertiary text-xs font-medium">Needs Review</p>
                            </div>
                            <p className="text-text-primary text-2xl font-semibold mb-1 tabular-nums">{flaggedCount}</p>
                            <p className="text-text-secondary text-xs">Waiting for action</p>
                        </div>

                        <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow transition-all duration-150 card-hover border border-border">
                            <div className="flex items-center gap-2.5 mb-3">
                                <TrendingDown className="w-4 h-4 text-text-tertiary" />
                                <p className="text-text-tertiary text-xs font-medium">Fraud Rate</p>
                            </div>
                            <p className="text-text-primary text-2xl font-semibold mb-1 tabular-nums">2.8%</p>
                            <p className="text-status-success text-xs font-medium">↓ 45% from last week</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 mb-6 animate-fade-in-up">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all btn-press ${filter === 'all'
                                ? 'bg-accent-primary text-white shadow-sm'
                                : 'bg-white text-text-secondary border border-border hover:shadow-sm'
                                }`}
                        >
                            All Orders
                        </button>
                        <button
                            onClick={() => setFilter('blocked')}
                            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all btn-press ${filter === 'blocked'
                                ? 'bg-status-danger text-white shadow-sm'
                                : 'bg-white text-text-secondary border border-border hover:shadow-sm'
                                }`}
                        >
                            Blocked
                        </button>
                        <button
                            onClick={() => setFilter('flagged')}
                            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all btn-press ${filter === 'flagged'
                                ? 'bg-status-warning text-white shadow-sm'
                                : 'bg-white text-text-secondary border border-border hover:shadow-sm'
                                }`}
                        >
                            Flagged
                        </button>
                        <button
                            onClick={() => setFilter('approved')}
                            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all btn-press ${filter === 'approved'
                                ? 'bg-status-success text-white shadow-sm'
                                : 'bg-white text-text-secondary border border-border hover:shadow-sm'
                                }`}
                        >
                            Approved
                        </button>
                    </div>

                    {/* Risk Orders List */}
                    <div className="space-y-3 animate-fade-in-up">
                        {filteredOrders.map((order) => {
                            const amountMatch = order.amount.match(/PKR\s*([\d,]+)/);
                            const displayAmount = amountMatch
                                ? `$${(parseInt(amountMatch[1].replace(/,/g, '')) * 0.0036).toFixed(0)}`
                                : order.amount;
                            return (
                                <div
                                    key={order.id}
                                    className="bg-white p-5 rounded-lg border border-border shadow-sm hover:shadow transition-all duration-150 card-hover"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center">
                                                {order.status === 'blocked' ? <Ban className="w-4 h-4 text-status-danger" /> :
                                                    order.status === 'flagged' ? <AlertTriangle className="w-4 h-4 text-status-warning" /> :
                                                        <CheckCircle className="w-4 h-4 text-status-success" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <p className="text-text-primary text-sm font-semibold">{order.orderNumber}</p>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.status === 'blocked' ? 'bg-status-danger/10 text-status-danger' :
                                                        order.status === 'flagged' ? 'bg-status-warning/10 text-status-warning' :
                                                            'bg-status-success/10 text-status-success'
                                                        }`}>
                                                        {order.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-text-secondary text-xs">{order.customer} • {order.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-text-primary text-sm font-semibold mb-0.5 tabular-nums">{displayAmount}</p>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-text-tertiary text-xs">Risk:</span>
                                                <span className={`text-xs font-semibold ${order.riskScore < 4 ? 'text-status-danger' :
                                                    order.riskScore < 7 ? 'text-status-warning' :
                                                        'text-status-success'
                                                    }`}>
                                                    {order.riskScore}/10
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-surface-base/50 p-3 rounded-lg">
                                            <p className="text-text-tertiary text-xs font-medium mb-1.5">Risk Reason</p>
                                            <p className="text-status-danger text-xs font-medium">{order.reason}</p>
                                        </div>
                                        <div className="bg-surface-base/50 p-3 rounded-lg">
                                            <p className="text-text-tertiary text-xs font-medium mb-1.5">AI Action</p>
                                            <p className="text-text-secondary text-xs font-medium">{order.aiAction}</p>
                                        </div>
                                    </div>

                                    {order.status === 'flagged' && (
                                        <div className="mt-3 flex gap-2">
                                            <button className="flex-1 bg-status-success hover:bg-status-success/90 text-white font-medium text-xs py-2 rounded-lg transition-all shadow-sm btn-press">
                                                Approve Order
                                            </button>
                                            <button className="flex-1 bg-status-danger hover:bg-status-danger/90 text-white font-medium text-xs py-2 rounded-lg transition-all shadow-sm btn-press">
                                                Block Order
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function CODRiskPage() {
    return (
        <AuthenticatedLayout>
            <AIRiskContent />
        </AuthenticatedLayout>
    )
}
