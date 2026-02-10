'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import EmptyState from '@/components/ui/EmptyState'
import { apiClient, Customer } from '@/lib/api-client'
import { getCustomerName, getCustomerEmail, getCustomerPhone, splitName } from '@/lib/dummy-data'
import { RefreshCw, AlertTriangle, Search, Users as UsersIcon, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

function CustomersPageContent() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<string>('recent')

    const fillMissingCustomerData = (customer: Customer): Customer => {
        const hasNoName = !customer.first_name && !customer.last_name
        let firstName = customer.first_name
        let lastName = customer.last_name

        if (hasNoName) {
            const fullName = getCustomerName(customer.id)
            const nameParts = splitName(fullName)
            firstName = nameParts.firstName
            lastName = nameParts.lastName
        }

        return {
            ...customer,
            first_name: firstName || 'Customer',
            last_name: lastName || `#${customer.id.toString().slice(-4)}`,
            email: getCustomerEmail(customer.id, customer.email),
            phone: getCustomerPhone(customer.id, customer.phone),
        }
    }

    const fetchCustomers = async (refresh = false) => {
        try {
            if (refresh) {
                setIsRefreshing(true)
                apiClient.clearCache() // Clear cache on manual refresh
            } else {
                // Only show loading on initial load if no cached data
                if (customers.length === 0) {
                    setIsLoading(true)
                }
            }
            setError(null)

            const response = await apiClient.getCustomers({ limit: 250 })

            // Fill missing data with consistent fallbacks
            const enrichedCustomers = response.customers.map(customer =>
                fillMissingCustomerData(customer)
            )

            setCustomers(enrichedCustomers)
            setFilteredCustomers(enrichedCustomers)

            if (refresh) {
                toast.success('Customers refreshed')
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch customers'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }


    useEffect(() => {
        fetchCustomers()
    }, [])

    useEffect(() => {
        let filtered = customers

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(customer =>
                customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                customer.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                customer.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                customer.phone?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Apply sorting
        filtered = [...filtered].sort((a, b) => {
            if (sortBy === 'recent') {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            }
            if (sortBy === 'orders') {
                return b.orders_count - a.orders_count
            }
            if (sortBy === 'spent') {
                return parseFloat(b.total_spent) - parseFloat(a.total_spent)
            }
            return 0
        })

        setFilteredCustomers(filtered)
    }, [searchQuery, sortBy, customers])

    const totalRevenue = filteredCustomers.reduce((sum, c) => sum + parseFloat(c.total_spent), 0)
    const totalOrders = filteredCustomers.reduce((sum, c) => sum + c.orders_count, 0)

    return (
        <div className="min-h-screen bg-white flex">
            <Sidebar activePage="Customers" />

            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="px-8 py-8 bg-white shadow-sm border-b border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-text-primary text-2xl font-bold tracking-tight">Customers</h1>
                            <p className="text-text-secondary text-sm mt-1.5">
                                View and manage your customer database
                            </p>
                        </div>
                        <button
                            onClick={() => fetchCustomers(true)}
                            disabled={isRefreshing}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-white bg-accent-primary hover:bg-accent-hover rounded-lg transition-all disabled:opacity-50 font-medium shadow-sm"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                            {isRefreshing ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </header>

                <div className="px-8 py-8">
                    {/* Filters */}
                    <div className="mb-6 flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
                            <input
                                type="text"
                                placeholder="Search customers by name, email, or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-white border border-border rounded-lg text-xs text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-primary"
                            />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 bg-white border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent-primary"
                        >
                            <option value="recent">Most Recent</option>
                            <option value="orders">Most Orders</option>
                            <option value="spent">Highest Spent</option>
                        </select>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-status-dangerLight border border-status-danger rounded-xl flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-status-danger flex-shrink-0" />
                            <div>
                                <p className="text-status-danger font-medium">Error loading customers</p>
                                <p className="text-sm text-status-danger/80">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Stats */}
                    {!isLoading && (
                        <div className="grid grid-cols-4 gap-4 mb-6 animate-fade-in-up">
                            <div className="bg-white p-5 rounded-lg border border-border shadow-sm hover:shadow transition-all duration-150">
                                <p className="text-text-tertiary text-xs font-medium mb-1">Total Customers</p>
                                <p className="text-text-primary text-2xl font-semibold tabular-nums">{customers.length}</p>
                            </div>
                            <div className="bg-white p-5 rounded-lg border border-border shadow-sm hover:shadow transition-all duration-150">
                                <p className="text-text-tertiary text-xs font-medium mb-1">Total Orders</p>
                                <p className="text-text-primary text-2xl font-semibold tabular-nums">{totalOrders}</p>
                            </div>
                            <div className="bg-white p-5 rounded-lg border border-border shadow-sm hover:shadow transition-all duration-150">
                                <p className="text-text-tertiary text-xs font-medium mb-1">Total Revenue</p>
                                <p className="text-text-primary text-2xl font-semibold tabular-nums">${totalRevenue.toFixed(2)}</p>
                            </div>
                            <div className="bg-white p-5 rounded-lg border border-border shadow-sm hover:shadow transition-all duration-150">
                                <p className="text-text-tertiary text-xs font-medium mb-1">Avg Order Value</p>
                                <p className="text-text-primary text-2xl font-semibold tabular-nums">
                                    ${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Customers Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
                        <div className="text-xs text-text-tertiary font-medium py-3 px-5 grid grid-cols-6 gap-4 bg-surface-base/50 border-b border-border">
                            <span className="col-span-2">Customer</span>
                            <span>Contact</span>
                            <span>Orders</span>
                            <span>Total Spent</span>
                            <span>Joined</span>
                        </div>

                        {isLoading ? (
                            <LoadingSkeleton type="customer" count={5} />
                        ) : filteredCustomers.length === 0 ? (
                            <EmptyState
                                illustration={searchQuery ? 'search' : 'customers'}
                                title={searchQuery ? 'No customers found' : 'No customers yet'}
                                description={searchQuery ? 'Try adjusting your search query' : 'Customers will appear here when they make their first purchase'}
                                action={searchQuery ? {
                                    label: 'Clear search',
                                    onClick: () => setSearchQuery('')
                                } : undefined}
                            />
                        ) : (
                            <div className="divide-y divide-border">
                                {filteredCustomers.map((customer) => {
                                    const fullName = [customer.first_name, customer.last_name]
                                        .filter(Boolean)
                                        .join(' ')
                                    const initials = [customer.first_name?.[0], customer.last_name?.[0]]
                                        .filter(Boolean)
                                        .join('')
                                        .toUpperCase() || 'CU'

                                    return (
                                        <div
                                            key={customer.id}
                                            className="grid grid-cols-6 gap-4 py-3 px-5 items-center hover:bg-surface-base/30 transition-colors"
                                        >
                                            <div className="col-span-2 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-hover flex items-center justify-center">
                                                    <span className="text-white text-sm font-bold">{initials}</span>
                                                </div>
                                                <div>
                                                    <p className="text-text-primary text-sm font-semibold">
                                                        {fullName}
                                                    </p>
                                                    <p className="text-text-tertiary text-xs mt-0.5">
                                                        ID: {customer.id}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-text-primary text-sm">
                                                    {customer.email}
                                                </p>
                                                <p className="text-text-tertiary text-xs mt-0.5">
                                                    {customer.phone}
                                                </p>
                                            </div>
                                            <span className="text-text-primary text-sm font-semibold">
                                                {customer.orders_count}
                                            </span>
                                            <span className="text-text-primary text-sm font-semibold tabular-nums">
                                                ${customer.total_spent}
                                            </span>
                                            <span className="text-text-secondary text-sm">
                                                {new Date(customer.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function CustomersPage() {
    return (
        <AuthenticatedLayout>
            <CustomersPageContent />
        </AuthenticatedLayout>
    )
}
