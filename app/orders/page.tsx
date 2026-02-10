'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'
import SlidePanel from '@/components/ui/SlidePanel'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import EmptyState from '@/components/ui/EmptyState'
import ContextMenu, { MenuAction } from '@/components/ui/ContextMenu'
import { apiClient, Order } from '@/lib/api-client'
import { getCustomerName } from '@/lib/dummy-data'
import { RefreshCw, AlertTriangle, Search, Package, Truck, CheckCircle, XCircle, Clock, DollarSign, Eye, Copy, Mail, Phone, Ban } from 'lucide-react'
import { toast } from 'sonner'

function OrdersPageContent() {
    const [orders, setOrders] = useState<Order[]>([])
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const fetchOrders = async (refresh = false) => {
        try {
            if (refresh) {
                setIsRefreshing(true)
                apiClient.clearCache() // Clear cache on manual refresh
            } else {
                // Only show loading on initial load if no cached data
                if (orders.length === 0) {
                    setIsLoading(true)
                }
            }
            setError(null)

            console.log('Fetching orders...', apiClient.hasCredentials())
            const response = await apiClient.getOrders({ limit: 250 })
            console.log('Orders response:', response)
            setOrders(response.orders)
            setFilteredOrders(response.orders)

            if (refresh) {
                toast.success('Orders refreshed')
            }
        } catch (err) {
            console.error('Error fetching orders:', err)
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    useEffect(() => {
        let filtered = orders

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(order =>
                order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.email?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => {
                if (statusFilter === 'fulfilled') return order.fulfillment_status === 'fulfilled'
                if (statusFilter === 'unfulfilled') return order.fulfillment_status === 'unfulfilled'
                if (statusFilter === 'paid') return order.financial_status === 'paid'
                if (statusFilter === 'pending') return order.financial_status === 'pending'
                return true
            })
        }

        setFilteredOrders(filtered)
    }, [searchQuery, statusFilter, orders])

    const getOrderActions = (order: Order): MenuAction[] => [
        {
            label: 'View Details',
            icon: Eye,
            onClick: () => setSelectedOrder(order)
        },
        {
            label: 'Copy Order ID',
            icon: Copy,
            onClick: () => {
                navigator.clipboard.writeText(order.name)
                toast.success('Order ID copied')
            }
        },
        {
            label: 'Email Customer',
            icon: Mail,
            onClick: () => {
                if (order.email) {
                    window.location.href = `mailto:${order.email}`
                } else {
                    toast.error('No email available')
                }
            },
            disabled: !order.email
        },
        {
            label: 'Call Customer',
            icon: Phone,
            onClick: () => {
                if (order.customer_phone) {
                    window.location.href = `tel:${order.customer_phone}`
                } else {
                    toast.error('No phone available')
                }
            },
            disabled: !order.customer_phone
        },
        {
            label: 'Cancel Order',
            icon: Ban,
            onClick: () => {
                toast.error('Cancel order functionality coming soon')
            },
            variant: 'danger'
        }
    ]

    return (
        <div className="min-h-screen bg-white flex">
            <Sidebar activePage="Orders" />

            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="px-8 py-8 bg-white shadow-sm border-b border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-text-primary text-2xl font-bold tracking-tight">Orders</h1>
                            <p className="text-text-secondary text-sm mt-1.5">
                                Manage and track all your orders in one place
                            </p>
                        </div>
                        <button
                            onClick={() => fetchOrders(true)}
                            disabled={isRefreshing}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-white bg-accent-primary hover:bg-accent-hover rounded-lg transition-all disabled:opacity-50 font-medium shadow-sm btn-press"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                            {isRefreshing ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </header>

                <div className="px-8 py-8">
                    {/* Filters */}
                    <div className="mb-6 flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
                            <input
                                type="text"
                                placeholder="Search orders by name, customer, or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-white border border-border rounded-lg text-xs text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-primary"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 bg-white border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent-primary"
                        >
                            <option value="all">All Orders</option>
                            <option value="fulfilled">Fulfilled</option>
                            <option value="unfulfilled">Unfulfilled</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-status-danger/10 border border-status-danger/30 rounded-lg flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-status-danger flex-shrink-0" />
                            <div>
                                <p className="text-status-danger font-medium text-xs">Error loading orders</p>
                                <p className="text-xs text-status-danger/80">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Stats */}
                    {!isLoading && (
                        <div className="grid grid-cols-4 gap-4 mb-6 animate-fade-in-up">
                            <div className="bg-white p-5 rounded-lg border border-border shadow-sm hover:shadow transition-all duration-150 card-hover">
                                <p className="text-text-tertiary text-xs font-medium mb-1">Total Orders</p>
                                <p className="text-text-primary text-2xl font-semibold tabular-nums">{orders.length}</p>
                            </div>
                            <div className="bg-white p-5 rounded-lg border border-border shadow-sm hover:shadow transition-all duration-150 card-hover">
                                <p className="text-text-tertiary text-xs font-medium mb-1">Fulfilled</p>
                                <p className="text-text-primary text-2xl font-semibold tabular-nums">
                                    {orders.filter(o => o.fulfillment_status === 'fulfilled').length}
                                </p>
                            </div>
                            <div className="bg-white p-5 rounded-lg border border-border shadow-sm hover:shadow transition-all duration-150 card-hover">
                                <p className="text-text-tertiary text-xs font-medium mb-1">Unfulfilled</p>
                                <p className="text-text-primary text-2xl font-semibold tabular-nums">
                                    {orders.filter(o => o.fulfillment_status === 'unfulfilled').length}
                                </p>
                            </div>
                            <div className="bg-white p-5 rounded-lg border border-border shadow-sm hover:shadow transition-all duration-150 card-hover">
                                <p className="text-text-tertiary text-xs font-medium mb-1">Filtered Results</p>
                                <p className="text-text-primary text-2xl font-semibold tabular-nums">{filteredOrders.length}</p>
                            </div>
                        </div>
                    )}

                    {/* Orders Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
                        <div className="text-xs text-text-tertiary font-medium py-3 px-5 grid grid-cols-[1fr_1.5fr_1fr_1.2fr_1.2fr_1fr_0.8fr_0.5fr] gap-4 bg-surface-base/50 border-b border-border">
                            <span>Order</span>
                            <span>Customer</span>
                            <span>Amount</span>
                            <span>Financial</span>
                            <span>Fulfillment</span>
                            <span>Date</span>
                            <span>Items</span>
                            <span className="text-right">Actions</span>
                        </div>

                        {isLoading ? (
                            <LoadingSkeleton type="order" count={5} />
                        ) : filteredOrders.length === 0 ? (
                            <EmptyState
                                illustration={searchQuery || statusFilter !== 'all' ? 'search' : 'orders'}
                                title={searchQuery || statusFilter !== 'all' ? 'No orders found' : 'No orders yet'}
                                description={searchQuery || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Orders will appear here when customers make purchases'}
                                action={statusFilter !== 'all' || searchQuery ? {
                                    label: 'Clear filters',
                                    onClick: () => {
                                        setSearchQuery('')
                                        setStatusFilter('all')
                                    }
                                } : undefined}
                            />
                        ) : (
                            <div className="divide-y divide-border">
                                {filteredOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="grid grid-cols-[1fr_1.5fr_1fr_1.2fr_1.2fr_1fr_0.8fr_0.5fr] gap-4 py-3 px-5 items-center hover:bg-surface-base/30 transition-colors cursor-pointer group"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <span className="text-text-primary font-mono text-sm font-medium truncate">
                                            {order.name}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-text-primary text-sm font-semibold truncate">
                                                {getCustomerName(order.id, order.customer_name)}
                                            </p>
                                            <p className="text-text-tertiary text-xs mt-0.5 truncate">
                                                {order.email || order.customer_phone || '-'}
                                            </p>
                                        </div>
                                        <span className="text-text-primary text-sm font-semibold truncate tabular-nums">
                                            {order.currency} {order.total_price}
                                        </span>
                                        <span className={`text-sm font-medium capitalize truncate ${order.financial_status === 'paid'
                                            ? 'text-status-success'
                                            : 'text-status-warning'
                                            }`}>
                                            {order.financial_status}
                                        </span>
                                        <span className={`text-sm font-medium capitalize truncate ${order.fulfillment_status === 'fulfilled'
                                            ? 'text-status-success'
                                            : 'text-status-danger'
                                            }`}>
                                            {order.fulfillment_status}
                                        </span>
                                        <span className="text-text-secondary text-sm truncate">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </span>
                                        <span className="text-text-secondary text-sm truncate tabular-nums">
                                            {order.line_items_count}
                                        </span>
                                        <div className="flex justify-end items-center flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                            <ContextMenu actions={getOrderActions(order)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Detail Slide Panel */}
                <SlidePanel
                    isOpen={selectedOrder !== null}
                    onClose={() => setSelectedOrder(null)}
                    title={selectedOrder?.name || 'Order Details'}
                    width="md"
                >
                    {selectedOrder && (
                        <div className="px-6 py-5 space-y-5">
                            {/* Order Timeline */}
                            <div>
                                <p className="text-text-tertiary text-xs font-medium mb-3">Order Timeline</p>
                                <div className="space-y-2.5">
                                    <div className="flex items-start gap-2.5">
                                        <div className="w-7 h-7 rounded-full bg-status-success/10 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-3.5 h-3.5 text-status-success" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-text-primary text-xs font-semibold">Order Placed</p>
                                            <p className="text-text-muted text-xs">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${selectedOrder.financial_status === 'paid' ? 'bg-status-successLight' : 'bg-status-warningLight'
                                            }`}>
                                            <DollarSign className={`w-4 h-4 ${selectedOrder.financial_status === 'paid' ? 'text-status-success' : 'text-status-warning'
                                                }`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-text-primary text-sm font-semibold">Payment {selectedOrder.financial_status === 'paid' ? 'Confirmed' : 'Pending'}</p>
                                            <p className="text-text-muted text-xs capitalize">{selectedOrder.financial_status} - COD</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${selectedOrder.fulfillment_status === 'fulfilled' ? 'bg-status-successLight' : 'bg-surface-base'
                                            }`}>
                                            <Truck className={`w-4 h-4 ${selectedOrder.fulfillment_status === 'fulfilled' ? 'text-status-success' : 'text-text-subtle'
                                                }`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-text-primary text-sm font-semibold">
                                                {selectedOrder.fulfillment_status === 'fulfilled' ? 'Delivered' : 'Preparing to Ship'}
                                            </p>
                                            <p className="text-text-muted text-xs capitalize">{selectedOrder.fulfillment_status}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* COD Status */}
                            <div className="bg-surface-base p-5 rounded-xl border border-border-subtle">
                                <p className="text-text-tertiary text-xs font-medium mb-3">COD Status</p>
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-text-primary text-2xl font-bold">{selectedOrder.currency} {selectedOrder.total_price}</p>
                                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${selectedOrder.financial_status === 'paid'
                                        ? 'bg-status-successLight text-status-success'
                                        : 'bg-status-warningLight text-status-warning'
                                        }`}>
                                        {selectedOrder.financial_status === 'paid' ? 'Collected' : 'Pending'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-text-muted mb-1">Customer</p>
                                        <p className="text-text-primary font-semibold">{getCustomerName(selectedOrder.id, selectedOrder.customer_name)}</p>
                                    </div>
                                    <div>
                                        <p className="text-text-muted mb-1">Items</p>
                                        <p className="text-text-primary font-semibold">{selectedOrder.line_items_count}</p>
                                    </div>
                                </div>
                            </div>

                            {/* AI Risk Analysis */}
                            <div className="bg-gradient-to-br from-accent-primary/10 to-accent-hover/10 border border-accent-primary/20 p-5 rounded-xl">
                                <p className="text-text-tertiary text-xs font-medium mb-3">AI Risk Analysis</p>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-text-primary text-lg font-bold">Risk Score: 7.8/10</span>
                                    <span className="text-xs px-3 py-1.5 rounded-full bg-status-successLight text-status-success font-medium">
                                        Low Risk
                                    </span>
                                </div>
                                <p className="text-text-secondary text-sm">✓ Verified customer with good payment history</p>
                            </div>

                            {/* AI Actions */}
                            <div>
                                <p className="text-text-tertiary text-xs font-medium mb-3">AI Recommended Actions</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-status-success flex-shrink-0" />
                                        <span className="text-text-secondary">Order automatically approved</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-status-success flex-shrink-0" />
                                        <span className="text-text-secondary">Customer verified via SMS</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-status-warning flex-shrink-0" />
                                        <span className="text-text-secondary">Delivery confirmation pending</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button className="flex-1 bg-status-success hover:bg-status-success/90 text-white font-semibold py-3 rounded-xl transition-colors">
                                    Confirm Delivery
                                </button>
                                <button className="flex-1 bg-status-danger hover:bg-status-danger/90 text-white font-semibold py-3 rounded-xl transition-colors">
                                    Cancel Order
                                </button>
                            </div>
                        </div>
                    )}
                </SlidePanel>
            </main>
        </div>
    )
}

export default function OrdersPage() {
    return (
        <AuthenticatedLayout>
            <OrdersPageContent />
        </AuthenticatedLayout>
    )
}
