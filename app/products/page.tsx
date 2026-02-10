'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import EmptyState from '@/components/ui/EmptyState'
import { apiClient, Product } from '@/lib/api-client'
import { RefreshCw, AlertTriangle, Search, Package as PackageIcon, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

function ProductsPageContent() {
    const [products, setProducts] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const fetchProducts = async (refresh = false) => {
        try {
            if (refresh) {
                setIsRefreshing(true)
                apiClient.clearCache() // Clear cache on manual refresh
            } else {
                // Only show loading on initial load if no cached data
                if (products.length === 0) {
                    setIsLoading(true)
                }
            }
            setError(null)

            const response = await apiClient.getProducts({ limit: 250 })
            console.log('Products response:', response.products.slice(0, 2)) // Log first 2 products to check image URLs
            setProducts(response.products)
            setFilteredProducts(response.products)

            if (refresh) {
                toast.success('Products refreshed')
            }
        } catch (err) {
            console.error('Error fetching products:', err)
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        let filtered = products

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(product => product.status === statusFilter)
        }

        setFilteredProducts(filtered)
    }, [searchQuery, statusFilter, products])

    const totalValue = filteredProducts.reduce((sum, p) => {
        const price = parseFloat(p.price || '0')
        const inventory = p.inventory_quantity || 0
        return sum + (price * inventory)
    }, 0)

    return (
        <div className="min-h-screen bg-white flex">
            <Sidebar activePage="Products" />

            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="px-8 py-8 bg-white shadow-sm border-b border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-text-primary text-2xl font-bold tracking-tight">Products</h1>
                            <p className="text-text-secondary text-sm mt-1.5">
                                Browse and manage your product catalog
                            </p>
                        </div>
                        <button
                            onClick={() => fetchProducts(true)}
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
                                placeholder="Search products by title, vendor, or SKU..."
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
                            <option value="all">All Products</option>
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-status-dangerLight border border-status-danger rounded-xl flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-status-danger flex-shrink-0" />
                            <div>
                                <p className="text-status-danger font-medium">Error loading products</p>
                                <p className="text-sm text-status-danger/80">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Stats */}
                    {!isLoading && (
                        <div className="grid grid-cols-4 gap-4 mb-6 animate-fade-in-up">
                            <div className="bg-white p-5 rounded-lg border border-border shadow-sm hover:shadow transition-all duration-150">
                                <p className="text-text-tertiary text-xs font-medium mb-1">Total Products</p>
                                <p className="text-text-primary text-2xl font-semibold tabular-nums">{products.length}</p>
                            </div>
                            <div className="bg-white p-5 rounded-lg border border-border shadow-sm hover:shadow transition-all duration-150">
                                <p className="text-text-tertiary text-xs font-medium mb-1">Active</p>
                                <p className="text-text-primary text-2xl font-semibold tabular-nums">
                                    {products.filter(p => p.status === 'active').length}
                                </p>
                            </div>
                            <div className="bg-white p-5 rounded-lg border border-border shadow-sm hover:shadow transition-all duration-150">
                                <p className="text-text-tertiary text-xs font-medium mb-1">Total Inventory</p>
                                <p className="text-text-primary text-2xl font-semibold tabular-nums">
                                    {filteredProducts.reduce((sum, p) => sum + (p.inventory_quantity || 0), 0)}
                                </p>
                            </div>
                            <div className="bg-white p-5 rounded-lg border border-border shadow-sm hover:shadow transition-all duration-150">
                                <p className="text-text-tertiary text-xs font-medium mb-1">Inventory Value</p>
                                <p className="text-text-primary text-2xl font-semibold tabular-nums">${totalValue.toFixed(2)}</p>
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
                        <div className="text-xs text-text-tertiary font-medium py-3 px-5 grid grid-cols-6 gap-4 bg-surface-base/50 border-b border-border">
                            <span className="col-span-2">Product</span>
                            <span>Vendor</span>
                            <span>Price</span>
                            <span>Inventory</span>
                            <span>Status</span>
                        </div>

                        {isLoading ? (
                            <LoadingSkeleton type="product" count={5} />
                        ) : filteredProducts.length === 0 ? (
                            <EmptyState
                                illustration={searchQuery || statusFilter !== 'all' ? 'search' : 'products'}
                                title={searchQuery || statusFilter !== 'all' ? 'No products found' : 'No products yet'}
                                description={searchQuery || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Products from your Shopify store will appear here'}
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
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="grid grid-cols-6 gap-4 py-3 px-5 items-center hover:bg-surface-base/30 transition-colors"
                                    >
                                        <div className="col-span-2 flex items-center gap-3">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.title}
                                                    className="w-10 h-10 rounded-lg object-cover border border-border-subtle"
                                                    onError={(e) => {
                                                        console.error('Image load error:', product.image_url)
                                                        e.currentTarget.style.display = 'none'
                                                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                                    }}
                                                />
                                            ) : null}
                                            <div className={`w-10 h-10 rounded-lg bg-surface-base border border-border-subtle flex items-center justify-center ${product.image_url ? 'hidden' : ''}`}>
                                                <PackageIcon className="w-5 h-5 text-text-subtle" />
                                            </div>
                                            <div>
                                                <p className="text-text-primary text-xs font-semibold">
                                                    {product.title}
                                                </p>
                                                <p className="text-text-tertiary text-xs mt-0.5">
                                                    SKU: {product.sku || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-text-secondary text-xs">
                                            {product.vendor}
                                        </span>
                                        <span className="text-text-primary text-xs font-semibold tabular-nums">
                                            ${product.price || '0.00'}
                                        </span>
                                        <span className={`text-xs font-medium ${(product.inventory_quantity || 0) > 10
                                            ? 'text-status-success'
                                            : (product.inventory_quantity || 0) > 0
                                                ? 'text-status-warning'
                                                : 'text-status-danger'
                                            }`}>
                                            {product.inventory_quantity ?? 0}
                                        </span>
                                        <span className={`text-sm font-medium capitalize ${product.status === 'active'
                                            ? 'text-status-success'
                                            : 'text-text-tertiary'
                                            }`}>
                                            {product.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function ProductsPage() {
    return (
        <AuthenticatedLayout>
            <ProductsPageContent />
        </AuthenticatedLayout>
    )
}
