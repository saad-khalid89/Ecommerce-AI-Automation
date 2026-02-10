/**
 * Type-safe API Client for Shopify Integration
 * Handles authentication, error handling, and request formatting
 */

// ============================================================================
// Types
// ============================================================================

export interface ShopifyCredentials {
    shop_domain: string
    access_token: string
}

export interface ShopInfo {
    id: number
    name: string
    email: string
    domain: string
    currency: string
    timezone: string
    plan_name: string
    address?: {
        city: string
        country: string
        country_code: string
    }
}

export interface Product {
    id: number
    title: string
    handle: string
    vendor: string
    product_type: string
    status: string
    price: string | null
    sku: string | null
    image_url: string | null
    inventory_quantity: number | null
    created_at: string | null
    updated_at: string | null
}

export interface Order {
    id: number
    name: string
    email: string | null
    total_price: string
    currency: string
    financial_status: string
    fulfillment_status: string
    customer_name: string | null
    customer_phone: string | null
    created_at: string
    line_items_count: number
    tags: string
}

export interface Customer {
    id: number
    email: string | null
    first_name: string | null
    last_name: string | null
    phone: string | null
    orders_count: number
    total_spent: string
    created_at: string
    tags: string
}

export interface DashboardStats {
    products_count: number
    orders_count: number
    pending_orders: number
    total_revenue: number
    currency: string
}

export interface APIError {
    error: string
    detail?: string
}

// ============================================================================
// API Client Class
// ============================================================================

interface CacheEntry<T> {
    data: T
    timestamp: number
}

class APIClient {
    private baseURL: string
    private shopDomain: string = ''
    private accessToken: string = ''
    private readonly CACHE_DURATION = 10 * 60 * 1000 // 10 minutes
    private readonly STALE_TIME = 30 * 1000 // 30 seconds - show stale data immediately
    private readonly CACHE_PREFIX = 'aion_cache_'
    private pendingRequests = new Map<string, Promise<any>>()

    constructor() {
        this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    }

    /**
     * Set Shopify credentials for authenticated requests
     */
    setCredentials(shopDomain: string, accessToken: string) {
        this.shopDomain = shopDomain
        this.accessToken = accessToken
    }

    /**
     * Clear stored credentials
     */
    clearCredentials() {
        this.shopDomain = ''
        this.accessToken = ''
        this.clearCache()
    }

    /**
     * Force clear all cached data
     */
    clearCache() {
        if (typeof window === 'undefined') return

        const keys = Object.keys(localStorage)
        keys.forEach(key => {
            if (key.startsWith(this.CACHE_PREFIX)) {
                localStorage.removeItem(key)
            }
        })
        console.log('Cache cleared')
    }

    /**
     * Get cached data if available and not expired
     * Returns { data, isStale } to support stale-while-revalidate
     */
    private getCached<T>(key: string): { data: T; isStale: boolean } | null {
        if (typeof window === 'undefined') return null

        try {
            const cached = localStorage.getItem(this.CACHE_PREFIX + key)
            if (!cached) return null

            const entry: CacheEntry<T> = JSON.parse(cached)
            const age = Date.now() - entry.timestamp

            // Hard expiration - delete and return null
            if (age > this.CACHE_DURATION) {
                localStorage.removeItem(this.CACHE_PREFIX + key)
                return null
            }

            // Soft expiration - return data but mark as stale
            const isStale = age > this.STALE_TIME
            return { data: entry.data, isStale }
        } catch (error) {
            console.error('Cache read error:', error)
            return null
        }
    }

    /**
     * Store data in cache
     */
    private setCache<T>(key: string, data: T): void {
        if (typeof window === 'undefined') return

        try {
            const entry: CacheEntry<T> = {
                data,
                timestamp: Date.now()
            }
            localStorage.setItem(this.CACHE_PREFIX + key, JSON.stringify(entry))
        } catch (error) {
            console.error('Cache write error:', error)
        }
    }

    /**
     * Refresh data in background and update cache
     */
    private async refreshInBackground<T>(key: string, fetcher: () => Promise<T>): Promise<void> {
        try {
            const result = await fetcher()
            this.setCache(key, result)
            console.log(`Background refresh completed for ${key}`)
        } catch (error) {
            console.error('Background refresh failed:', error)
        }
    }

    /**
     * Check if credentials are set
     */
    hasCredentials(): boolean {
        return Boolean(this.shopDomain && this.accessToken)
    }

    /**
     * Get authentication headers
     */
    private getAuthHeaders(): HeadersInit {
        return {
            'Content-Type': 'application/json',
            'X-Shop-Domain': this.shopDomain,
            'X-Access-Token': this.accessToken,
        }
    }

    /**
     * Make authenticated HTTP request
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`

        try {
            const response = await fetch(url, {
                ...options,
                mode: 'cors',
                headers: {
                    ...this.getAuthHeaders(),
                    ...options.headers,
                },
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.detail || data.error || 'Request failed')
            }

            return data as T
        } catch (error) {
            if (error instanceof Error) {
                // Check if it's a network error
                if (error.message === 'Failed to fetch') {
                    throw new Error(`Cannot connect to API server at ${this.baseURL}. Make sure the backend is running.`)
                }
                throw new Error(`API Error: ${error.message}`)
            }
            throw new Error('Unknown API error occurred')
        }
    }

    // ==========================================================================
    // Authentication
    // ==========================================================================

    /**
     * Validate Shopify credentials
     */
    async validateCredentials(
        credentials: ShopifyCredentials
    ): Promise<{ valid: boolean; shop: ShopInfo }> {
        return this.request('/v1/shopify/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        })
    }

    // ==========================================================================
    // Shop Information
    // ==========================================================================

    /**
     * Get shop information
     */
    async getShopInfo(): Promise<ShopInfo> {
        return this.request('/v1/shopify/shop')
    }

    // ==========================================================================
    // Products
    // ==========================================================================

    /**
     * Get products from Shopify
     */
    async getProducts(params?: {
        limit?: number
        status?: 'active' | 'archived' | 'draft'
    }): Promise<{ count: number; products: Product[] }> {
        const cacheKey = `products_${JSON.stringify(params || {})}`

        // Check for pending request to avoid duplicate calls
        if (this.pendingRequests.has(cacheKey)) {
            return this.pendingRequests.get(cacheKey)!
        }

        const cached = this.getCached<{ count: number; products: Product[] }>(cacheKey)
        if (cached) {
            console.log('Returning cached products', cached.isStale ? '(stale)' : '')
            // If stale, refresh in background
            if (cached.isStale) {
                this.refreshInBackground(cacheKey, async () => {
                    const queryParams = new URLSearchParams()
                    if (params?.limit) queryParams.append('limit', params.limit.toString())
                    if (params?.status) queryParams.append('status', params.status)
                    const query = queryParams.toString()
                    return this.request<{ count: number; products: Product[] }>(`/v1/shopify/products${query ? `?${query}` : ''}`)
                })
            }
            return cached.data
        }

        const queryParams = new URLSearchParams()
        if (params?.limit) queryParams.append('limit', params.limit.toString())
        if (params?.status) queryParams.append('status', params.status)

        const query = queryParams.toString()
        const promise = this.request<{ count: number; products: Product[] }>(`/v1/shopify/products${query ? `?${query}` : ''}`)
        this.pendingRequests.set(cacheKey, promise)

        try {
            const result = await promise
            this.setCache(cacheKey, result)
            return result
        } finally {
            this.pendingRequests.delete(cacheKey)
        }
    }

    // ==========================================================================
    // Orders
    // ==========================================================================

    /**
     * Get orders from Shopify
     */
    async getOrders(params?: {
        limit?: number
        status?: 'open' | 'closed' | 'cancelled' | 'any'
    }): Promise<{ count: number; orders: Order[] }> {
        const cacheKey = `orders_${JSON.stringify(params || {})}`

        if (this.pendingRequests.has(cacheKey)) {
            return this.pendingRequests.get(cacheKey)!
        }

        const cached = this.getCached<{ count: number; orders: Order[] }>(cacheKey)
        if (cached) {
            console.log('Returning cached orders', cached.isStale ? '(stale, refreshing...)' : '')
            if (cached.isStale) {
                this.refreshInBackground(cacheKey, async () => {
                    const queryParams = new URLSearchParams()
                    if (params?.limit) queryParams.append('limit', params.limit.toString())
                    if (params?.status) queryParams.append('status', params.status)
                    const query = queryParams.toString()
                    return this.request<{ count: number; orders: Order[] }>(`/v1/shopify/orders${query ? `?${query}` : ''}`)
                })
            }
            return cached.data
        }

        const queryParams = new URLSearchParams()
        if (params?.limit) queryParams.append('limit', params.limit.toString())
        if (params?.status) queryParams.append('status', params.status)

        const query = queryParams.toString()
        const promise = this.request<{ count: number; orders: Order[] }>(`/v1/shopify/orders${query ? `?${query}` : ''}`)
        this.pendingRequests.set(cacheKey, promise)

        try {
            const result = await promise
            this.setCache(cacheKey, result)
            return result
        } finally {
            this.pendingRequests.delete(cacheKey)
        }
    }

    // ==========================================================================
    // Customers
    // ==========================================================================

    /**
     * Get customers from Shopify
     */
    async getCustomers(params?: {
        limit?: number
    }): Promise<{ count: number; customers: Customer[] }> {
        const cacheKey = `customers_${JSON.stringify(params || {})}`

        if (this.pendingRequests.has(cacheKey)) {
            return this.pendingRequests.get(cacheKey)!
        }

        const cached = this.getCached<{ count: number; customers: Customer[] }>(cacheKey)
        if (cached) {
            console.log('Returning cached customers', cached.isStale ? '(stale, refreshing...)' : '')
            if (cached.isStale) {
                this.refreshInBackground(cacheKey, async () => {
                    const queryParams = new URLSearchParams()
                    if (params?.limit) queryParams.append('limit', params.limit.toString())
                    const query = queryParams.toString()
                    return this.request<{ count: number; customers: Customer[] }>(`/v1/shopify/customers${query ? `?${query}` : ''}`)
                })
            }
            return cached.data
        }

        const queryParams = new URLSearchParams()
        if (params?.limit) queryParams.append('limit', params.limit.toString())

        const query = queryParams.toString()
        const promise = this.request<{ count: number; customers: Customer[] }>(`/v1/shopify/customers${query ? `?${query}` : ''}`)
        this.pendingRequests.set(cacheKey, promise)

        try {
            const result = await promise
            this.setCache(cacheKey, result)
            return result
        } finally {
            this.pendingRequests.delete(cacheKey)
        }
    }

    // ==========================================================================
    // Dashboard Stats
    // ==========================================================================

    /**
     * Get dashboard statistics
     */
    async getDashboardStats(): Promise<DashboardStats> {
        const cacheKey = 'dashboard_stats'

        if (this.pendingRequests.has(cacheKey)) {
            return this.pendingRequests.get(cacheKey)!
        }

        const cached = this.getCached<DashboardStats>(cacheKey)
        if (cached) {
            console.log('Returning cached dashboard stats', cached.isStale ? '(stale, refreshing...)' : '')
            if (cached.isStale) {
                this.refreshInBackground(cacheKey, async () => {
                    return this.request<DashboardStats>('/v1/shopify/stats')
                })
            }
            return cached.data
        }

        const promise = this.request<DashboardStats>('/v1/shopify/stats')
        this.pendingRequests.set(cacheKey, promise)

        try {
            const result = await promise
            this.setCache(cacheKey, result)
            return result
        } finally {
            this.pendingRequests.delete(cacheKey)
        }
    }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const apiClient = new APIClient()

// ============================================================================
// Convenience Functions
// ============================================================================

export async function validateShopifyCredentials(
    credentials: ShopifyCredentials
) {
    return apiClient.validateCredentials(credentials)
}

export async function fetchProducts(limit = 50) {
    return apiClient.getProducts({ limit })
}

export async function fetchOrders(limit = 50) {
    return apiClient.getOrders({ limit, status: 'any' })
}

export async function fetchCustomers(limit = 50) {
    return apiClient.getCustomers({ limit })
}

export async function fetchDashboardStats() {
    return apiClient.getDashboardStats()
}
