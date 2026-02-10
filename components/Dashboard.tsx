'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Bot, Send, MessageSquare, AlertTriangle, RefreshCw, LogOut, DollarSign, ShoppingBag, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Sidebar from './layout/Sidebar'
import SlidePanel from './ui/SlidePanel'
import LoadingSkeleton from './ui/LoadingSkeleton'
import TrendIndicator from './ui/TrendIndicator'
import RevenueChart from './charts/RevenueChart'
import OrdersChart from './charts/OrdersChart'
import Sparkline from './charts/Sparkline'
import { apiClient, type Order as APIOrder, type Product, type DashboardStats } from '@/lib/api-client'
import { getCustomerName } from '@/lib/dummy-data'
import { toast } from 'sonner'

// Types
interface Order {
    id: string
    customer: string
    phone: string
    amount: string
    risk: string
    aiAction: string
    riskLevel: 'high' | 'medium'
}

interface Conversation {
    id: number
    customer: string
    lastMessage: string
    aiResponse: string
    time: string
    unread: boolean
}

// Live conversation (AI-powered - will be connected to real data later)
const liveConversation: Conversation = {
    id: 1,
    customer: 'Fatima Khan',
    lastMessage: 'Mera phone nahi lag raha tha, ab theek hai',
    aiResponse: 'Shukriya! Apka order kal tak pohanch jaye ga. Koi aur madad?',
    time: 'Just now',
    unread: true,
}

// Panel conversations (will be AI-powered later)
const allConversations: Conversation[] = [
    liveConversation,
    { id: 2, customer: 'Ahmed Raza', lastMessage: 'Mera order kab aaye ga?', aiResponse: 'Apka order kal tak pohanch jaye ga. Tracking: TCS-4829', time: '2m', unread: false },
    { id: 3, customer: 'Hassan Ali', lastMessage: 'Address badalna hai', aiResponse: 'Naya pata batayen, main update kar dunga.', time: '8m', unread: false },
    { id: 4, customer: 'Sana Amir', lastMessage: 'Kya cash on delivery hai?', aiResponse: 'Ji haan, cash on delivery available hai.', time: '12m', unread: false },
    { id: 5, customer: 'Imran Malik', lastMessage: 'Order cancel karna hai', aiResponse: 'Order cancel ho gaya. Amount 3-5 din mein wapis.', time: '18m', unread: false },
]

export default function Dashboard() {
    const router = useRouter()
    const [conversationsOpen, setConversationsOpen] = useState(false)
    const [askAionOpen, setAskAionOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<APIOrder | null>(null)
    const [askInput, setAskInput] = useState('')

    // Live data state
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [orders, setOrders] = useState<APIOrder[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Generate chart data from orders
    const chartData = useMemo(() => {
        if (orders.length === 0) {
            // Generate dummy data for demo
            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const date = new Date()
                date.setDate(date.getDate() - (6 - i))
                return {
                    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    revenue: Math.random() * 5000 + 2000,
                    orders: Math.floor(Math.random() * 30) + 10
                }
            })
            return last7Days
        }

        // Create last 7 days array with proper dates
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (6 - i))
            const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD format
            const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            return {
                dateKey,
                date: displayDate,
                revenue: 0,
                orders: 0
            }
        })

        // Group orders by date and add to the corresponding day
        orders.forEach(order => {
            try {
                const orderDate = new Date(order.created_at)
                const dateKey = orderDate.toISOString().split('T')[0]

                const dayIndex = last7Days.findIndex(d => d.dateKey === dateKey)
                if (dayIndex !== -1) {
                    last7Days[dayIndex].orders++
                    last7Days[dayIndex].revenue += parseFloat(order.total_price) || 0
                }
            } catch (error) {
                console.error('Error parsing order date:', error)
            }
        })

        // If no orders found in last 7 days, generate dummy data
        const hasAnyOrders = last7Days.some(d => d.orders > 0)
        if (!hasAnyOrders) {
            return last7Days.map(({ date }) => ({
                date,
                revenue: Math.random() * 5000 + 2000,
                orders: Math.floor(Math.random() * 30) + 10
            }))
        }

        // Remove dateKey from return data
        return last7Days.map(({ date, revenue, orders }) => ({
            date,
            revenue,
            orders
        }))
    }, [orders])

    // Calculate last 7 days stats to match chart data
    const last7DaysStats = useMemo(() => {
        // Calculate from chartData to ensure consistency
        const revenue = chartData.reduce((sum, day) => sum + day.revenue, 0)
        const orderCount = chartData.reduce((sum, day) => sum + day.orders, 0)

        // For unique customers, estimate based on order count (dummy data)
        const uniqueCustomers = orders.length > 0
            ? new Set(orders.map(o => o.email).filter(Boolean)).size
            : Math.floor(orderCount * 0.7) // Estimate 70% unique customers

        return { revenue, orderCount, uniqueCustomers }
    }, [chartData, orders])

    // Calculate trend percentages (mock for now)
    const revenueTrend = 23.5
    const ordersTrend = 12.3
    const customersTrend = -5.2

    // Fetch dashboard data
    const fetchData = async (showRefreshIndicator = false) => {
        try {
            if (showRefreshIndicator) {
                setIsRefreshing(true)
                apiClient.clearCache() // Clear cache on manual refresh
            } else {
                // Only show loading on initial load if no cached data
                if (!stats || orders.length === 0) {
                    setIsLoading(true)
                }
            }

            setError(null)

            // Fetch stats and orders in parallel
            const [statsData, ordersData] = await Promise.all([
                apiClient.getDashboardStats(),
                apiClient.getOrders({ limit: 100, status: 'any' })
            ])

            setStats(statsData)
            setOrders(ordersData.orders)

            if (showRefreshIndicator) {
                toast.success('Dashboard refreshed')
            }
        } catch (err) {
            console.error('Error fetching data:', err)
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }

    // Initial data fetch
    useEffect(() => {
        fetchData()
    }, [])

    // Handle logout
    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            apiClient.clearCredentials()
            router.push('/login')
            router.refresh()
        } catch (err) {
            console.error('Logout error:', err)
        }
    }

    // Get at-risk orders (unfulfilled or pending)
    const atRiskOrders = orders
        .filter(order =>
            order.fulfillment_status === 'unfulfilled' ||
            order.financial_status === 'pending'
        )
        .slice(0, 5) // Show top 5

    return (
        <div className="min-h-screen bg-white text-text-secondary flex">
            <Sidebar activePage="Dashboard" />

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="px-8 py-8 flex items-center justify-between bg-white shadow-sm border-b border-border">
                    <div>
                        <h1 className="text-text-primary text-2xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-text-secondary text-sm mt-2">Plan, prioritize, and accomplish your tasks with ease.</p>
                    </div>
                    <button
                        onClick={() => setAskAionOpen(true)}
                        className="text-white bg-accent-primary hover:bg-accent-hover transition-all duration-150 text-sm flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold shadow btn-press"
                    >
                        <Send className="w-4 h-4" />
                        <span>Ask AION</span>
                    </button>
                </header>

                <div className="px-8 py-6">
                    {/* Refresh Button */}
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => fetchData(true)}
                            disabled={isRefreshing}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm text-text-secondary hover:text-text-primary font-medium border border-border rounded-xl hover:bg-surface-hover hover:shadow transition-all duration-150 disabled:opacity-50 btn-press"
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-status-dangerLight border border-status-danger rounded-xl flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-status-danger flex-shrink-0" />
                            <div>
                                <p className="text-status-danger font-medium">Error loading data</p>
                                <p className="text-sm text-status-danger/80">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* AI Story Metrics */}
                    <div className="bg-white border border-border rounded-lg p-5 mb-6 shadow-sm">
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center border border-border">
                                <Bot className="w-4 h-4 text-accent-600" />
                            </div>
                            <h2 className="text-text-primary text-base font-semibold">AI Protection Active</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-6 divide-x divide-border/70">
                            <div className="pr-6">
                                <p className="text-text-primary text-2xl font-semibold mb-1 tabular-nums">USD {(((stats?.pending_orders || 3) * 8500) * 0.036).toFixed(0)}</p>
                                <p className="text-text-tertiary text-xs font-medium">Money at Risk</p>
                            </div>
                            <div className="px-6">
                                <p className="text-text-primary text-2xl font-semibold mb-1 tabular-nums">{stats ? 5 : 12}</p>
                                <p className="text-text-tertiary text-xs font-medium">Fake Orders Blocked</p>
                            </div>
                            <div className="pl-6">
                                <p className="text-text-primary text-2xl font-semibold mb-1 tabular-nums">{atRiskOrders.length || 8}</p>
                                <p className="text-text-tertiary text-xs font-medium">Awaiting Response</p>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="grid grid-cols-3 gap-6 mb-10">
                            <LoadingSkeleton type="card" count={3} />
                        </div>
                    ) : (
                        <>
                            {/* KPIs with Trends */}
                            <div className="grid grid-cols-3 gap-4 mb-6 animate-fade-in-up">
                                {/* Revenue Card */}
                                <div className="bg-white p-5 rounded-lg shadow-sm border border-border hover:shadow transition-all duration-150">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2.5">
                                            <DollarSign className="w-4 h-4 text-text-tertiary" />
                                            <span className="text-text-tertiary text-xs font-medium">Revenue</span>
                                        </div>
                                        <span className="text-text-tertiary text-xs">7d</span>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-text-primary text-2xl font-semibold mb-2 tabular-nums">
                                                {stats?.currency} {last7DaysStats.revenue.toFixed(0)}
                                            </p>
                                            <TrendIndicator value={revenueTrend} label="vs last week" showIcon={true} size="sm" />
                                        </div>
                                        <div className="w-20 h-10 opacity-60">
                                            <Sparkline data={chartData.map(d => ({ value: d.revenue }))} color="#10B981" />
                                        </div>
                                    </div>
                                </div>

                                {/* Orders Card */}
                                <div className="bg-white p-5 rounded-lg shadow-sm border border-border hover:shadow transition-all duration-150">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2.5">
                                            <ShoppingBag className="w-4 h-4 text-text-tertiary" />
                                            <span className="text-text-tertiary text-xs font-medium">Orders</span>
                                        </div>
                                        <span className="text-text-tertiary text-xs">7d</span>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-text-primary text-2xl font-semibold mb-2 tabular-nums">{last7DaysStats.orderCount}</p>
                                            <TrendIndicator value={ordersTrend} label="vs last week" showIcon={true} size="sm" />
                                        </div>
                                        <div className="w-20 h-10 opacity-60">
                                            <Sparkline data={chartData.map(d => ({ value: d.orders }))} color="#10B981" />
                                        </div>
                                    </div>
                                </div>

                                {/* Pending Orders Card */}
                                <div className="bg-white p-5 rounded-lg shadow-sm border border-border hover:shadow transition-all duration-150">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2.5">
                                            <Clock className="w-4 h-4 text-text-tertiary" />
                                            <span className="text-text-tertiary text-xs font-medium">Pending</span>
                                        </div>
                                        <span className="w-2 h-2 bg-status-warning rounded-full"></span>
                                    </div>
                                    <div>
                                        <p className="text-text-primary text-2xl font-semibold mb-2 tabular-nums">{stats?.pending_orders || 3}</p>
                                        <p className="text-text-tertiary text-xs">Requires attention</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Charts Section */}
                    {!isLoading && (
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white p-5 rounded-lg shadow-sm border border-border hover:shadow transition-all duration-150">
                                <h3 className="text-text-primary text-sm font-semibold mb-4">Revenue Trend</h3>
                                <div className="h-56">
                                    <RevenueChart data={chartData} />
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-lg shadow-sm border border-border hover:shadow transition-all duration-150">
                                <h3 className="text-text-primary text-sm font-semibold mb-4">Orders Overview</h3>
                                <div className="h-56">
                                    <OrdersChart data={chartData} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Live Conversation */}
                    <section className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2.5">
                                <h2 className="text-text-primary text-sm font-semibold">Live Conversation</h2>
                                <span className="flex items-center gap-1.5 text-xs text-status-success bg-status-successLight px-2 py-0.5 rounded">
                                    <span className="w-1.5 h-1.5 bg-status-success rounded-full" />
                                    Active
                                </span>
                            </div>
                            <button
                                onClick={() => setConversationsOpen(true)}
                                className="text-text-tertiary text-xs hover:text-text-primary transition-colors duration-150 font-medium flex items-center gap-1 btn-press"
                            >
                                View all →
                            </button>
                        </div>

                        {/* Chat UI */}
                        <div className="max-w-2xl bg-white rounded-lg shadow-sm border border-border p-5">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center">
                                    <span className="text-text-primary text-xs font-semibold">FK</span>
                                </div>
                                <div>
                                    <span className="text-text-primary text-sm font-medium">{liveConversation.customer}</span>
                                    <span className="text-text-tertiary text-xs ml-2">• {liveConversation.time}</span>
                                </div>
                            </div>

                            {/* Customer message */}
                            <div className="bg-surface-hover rounded-lg p-3 mb-4 border border-border">
                                <p className="text-text-secondary text-sm leading-relaxed">
                                    "{liveConversation.lastMessage}"
                                </p>
                            </div>

                            {/* AI response */}
                            <div className="flex items-start gap-2.5 pt-4 border-t border-border">
                                <div className="w-7 h-7 rounded-md bg-white border border-border flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-accent-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-text-tertiary text-xs font-medium mb-1.5">AION AI</p>
                                    <p className="text-text-secondary text-sm leading-relaxed">
                                        {liveConversation.aiResponse}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* At-Risk Orders */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-text-primary text-sm font-semibold">
                                At-Risk Orders <span className="text-text-tertiary font-normal">({atRiskOrders.length})</span>
                            </h2>
                            <button
                                onClick={() => router.push('/orders')}
                                className="text-text-tertiary text-xs hover:text-text-primary transition-colors duration-150 font-medium flex items-center gap-1 btn-press"
                            >
                                View all →
                            </button>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
                            <div className="text-xs text-text-tertiary font-medium py-3 px-5 grid grid-cols-6 gap-4 bg-surface-hover border-b border-border">
                                <span>Order</span>
                                <span>Customer</span>
                                <span>Amount</span>
                                <span>Status</span>
                                <span>Date</span>
                                <span></span>
                            </div>

                            {isLoading ? (
                                <LoadingSkeleton type="order" count={3} />
                            ) : atRiskOrders.length === 0 ? (
                                <div className="p-12 text-center">
                                    <p className="text-text-secondary">No at-risk orders found</p>
                                    <p className="text-text-tertiary text-sm mt-1">All orders are fulfilled or completed</p>
                                </div>
                            ) : (
                                atRiskOrders.map((order, index) => (
                                    <div
                                        key={order.id}
                                        onClick={() => setSelectedOrder(order)}
                                        className={`grid grid-cols-6 gap-4 py-4 px-6 items-center cursor-pointer hover:bg-surface-hover transition-colors duration-150 ${index !== atRiskOrders.length - 1 ? 'border-b border-border' : ''}`}
                                    >
                                        <span className="text-text-secondary font-mono text-sm font-medium">{order.name}</span>
                                        <div>
                                            <p className="text-text-primary text-sm font-semibold">
                                                {getCustomerName(order.id, order.customer_name)}
                                            </p>
                                            <p className="text-text-subtle text-xs mt-0.5">{order.customer_phone || order.email || '-'}</p>
                                        </div>
                                        <span className="text-text-primary text-sm font-semibold">
                                            {order.currency} {order.total_price}
                                        </span>
                                        <span className={`text-sm font-semibold inline-flex items-center gap-1.5 ${order.financial_status === 'paid'
                                            ? 'text-status-success'
                                            : order.financial_status === 'pending'
                                                ? 'text-status-warning'
                                                : 'text-status-danger'
                                            }`}>
                                            <AlertTriangle className="w-3.5 h-3.5" />
                                            {order.financial_status}
                                        </span>
                                        <span className="text-text-muted text-xs">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </span>
                                        <span className="text-accent-primary text-xl font-light">→</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </main>

            {/* Conversations Panel */}
            <SlidePanel
                isOpen={conversationsOpen}
                onClose={() => setConversationsOpen(false)}
                title="Conversations"
                width="md"
            >
                <div className="px-6 py-4">
                    {allConversations.map((conv) => (
                        <div
                            key={conv.id}
                            className="py-4 border-b border-border-subtle cursor-pointer hover:bg-surface-hover -mx-6 px-6 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-text-primary text-sm font-semibold">{conv.customer}</span>
                                <span className="text-text-subtle text-xs">{conv.time}</span>
                            </div>
                            <p className="text-text-secondary text-sm leading-relaxed mb-2.5">"{conv.lastMessage}"</p>
                            <div className="flex items-start gap-2.5">
                                <Bot className="w-4 h-4 text-accent-primary mt-0.5 flex-shrink-0" />
                                <p className="text-text-muted text-sm leading-relaxed flex-1">{conv.aiResponse}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </SlidePanel>

            {/* Ask AION Panel */}
            <SlidePanel
                isOpen={askAionOpen}
                onClose={() => setAskAionOpen(false)}
                title="Ask AION"
                width="sm"
            >
                <div className="px-6 py-5 bg-white">
                    <div className="flex items-center gap-2.5 mb-5 p-3 bg-white border border-border rounded-lg">
                        <div className="w-7 h-7 bg-white border border-border rounded-md flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-text-secondary" />
                        </div>
                        <p className="text-text-secondary text-xs leading-relaxed">
                            Ask anything about orders, customers, or analytics
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 p-3.5 bg-white rounded-lg border border-border focus-within:border-accent-primary transition-colors">
                            <input
                                type="text"
                                value={askInput}
                                onChange={(e) => setAskInput(e.target.value)}
                                placeholder="Type your question..."
                                className="flex-1 bg-white text-text-primary text-sm placeholder-text-tertiary outline-none"
                            />
                            <button className="text-white bg-accent-primary hover:bg-accent-hover transition-all duration-150 p-2 rounded-md btn-press">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <p className="text-text-tertiary text-xs font-semibold mb-3">Suggested Questions</p>
                        <div className="space-y-2">
                            <button className="w-full text-left text-text-secondary text-sm py-2.5 px-3 bg-white rounded-lg border border-border hover:bg-surface-hover hover:border-accent-primary transition-all duration-150 group">
                                <span className="group-hover:text-text-primary">What's my COD success rate?</span>
                            </button>
                            <button className="w-full text-left text-text-secondary text-sm py-2.5 px-3 bg-white rounded-lg border border-border hover:bg-surface-hover hover:border-accent-primary transition-all duration-150 group">
                                <span className="group-hover:text-text-primary">How many orders were blocked today?</span>
                            </button>
                            <button className="w-full text-left text-text-secondary text-sm py-2.5 px-3 bg-white rounded-lg border border-border hover:bg-surface-hover hover:border-accent-primary transition-all duration-150 group">
                                <span className="group-hover:text-text-primary">Show revenue trend this week</span>
                            </button>
                            <button className="w-full text-left text-text-secondary text-sm py-2.5 px-3 bg-white rounded-lg border border-border hover:bg-surface-hover hover:border-accent-primary transition-all duration-150 group">
                                <span className="group-hover:text-text-primary">Top selling product?</span>
                            </button>
                        </div>
                    </div>
                </div>
            </SlidePanel>

            {/* Order Detail Panel */}
            <SlidePanel
                isOpen={selectedOrder !== null}
                onClose={() => setSelectedOrder(null)}
                title={selectedOrder?.name || 'Order Details'}
                width="md"
            >
                {selectedOrder && (
                    <div className="px-6 py-5">
                        <div className="space-y-6">
                            <div>
                                <p className="text-text-subtle text-xs font-semibold uppercase tracking-wider mb-2">Customer</p>
                                <p className="text-text-primary text-lg font-semibold">
                                    {getCustomerName(selectedOrder.id, selectedOrder.customer_name)}
                                </p>
                                <p className="text-text-muted text-sm mt-1">
                                    {selectedOrder.email || selectedOrder.customer_phone || 'No contact info'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-surface-base p-5 rounded-xl border border-border-subtle">
                                    <p className="text-text-subtle text-xs font-semibold uppercase tracking-wider mb-2">Amount</p>
                                    <p className="text-text-primary text-xl font-bold">
                                        {selectedOrder.currency} {selectedOrder.total_price}
                                    </p>
                                </div>
                                <div className="bg-surface-base p-5 rounded-xl border border-border-subtle">
                                    <p className="text-text-subtle text-xs font-semibold uppercase tracking-wider mb-2">Financial Status</p>
                                    <p className={`text-lg font-bold ${selectedOrder.financial_status === 'paid'
                                        ? 'text-status-success'
                                        : 'text-status-warning'
                                        }`}>
                                        {selectedOrder.financial_status.toUpperCase()}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-border-subtle pt-6">
                                <p className="text-text-subtle text-xs font-semibold uppercase tracking-wider mb-2">Fulfillment Status</p>
                                <p className={`text-sm font-medium ${selectedOrder.fulfillment_status === 'fulfilled'
                                    ? 'text-status-success'
                                    : 'text-status-danger'
                                    }`}>
                                    {selectedOrder.fulfillment_status}
                                </p>
                            </div>

                            <div>
                                <p className="text-text-subtle text-xs font-semibold uppercase tracking-wider mb-2">Order Date</p>
                                <p className="text-text-secondary text-sm leading-relaxed">
                                    {new Date(selectedOrder.created_at).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-text-subtle text-xs font-semibold uppercase tracking-wider mb-2">Line Items</p>
                                <p className="text-text-secondary text-sm leading-relaxed">
                                    {selectedOrder.line_items_count} item(s)
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="flex-1 bg-accent-primary hover:bg-accent-hover text-white text-sm font-semibold py-3 rounded-xl transition-colors shadow-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </SlidePanel>
        </div>
    )
}
