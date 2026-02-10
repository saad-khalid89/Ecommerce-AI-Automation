'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import NProgress from 'nprogress'
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    MessageSquare,
    Shield,
    BarChart3,
    Megaphone,
    Settings,
    LogOut,
    Sparkles,
    LucideIcon
} from 'lucide-react'
import { apiClient } from '@/lib/api-client'

interface NavItem {
    icon: LucideIcon
    label: string
    href: string
}

const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: ShoppingCart, label: 'Orders', href: '/orders' },
    { icon: Package, label: 'Products', href: '/products' },
    { icon: Users, label: 'Customers', href: '/customers' },
    { icon: MessageSquare, label: 'Conversations', href: '/conversations' },
    { icon: Shield, label: 'COD & Risk', href: '/cod-risk' },
    { icon: BarChart3, label: 'Insights', href: '/insights' },
    { icon: Sparkles, label: 'Ask AION', href: '/ask-aion' },
    { icon: Megaphone, label: 'Marketing', href: '/marketing' },
    { icon: Settings, label: 'Settings', href: '/settings' },
]

interface SidebarProps {
    activePage?: string
}

export default function Sidebar({ activePage = 'Dashboard' }: SidebarProps) {
    const router = useRouter()
    const pathname = usePathname()

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

    return (
        <aside className="w-60 min-h-screen bg-white border-r border-border flex flex-col py-7 px-4 shadow-sm">
            {/* Logo */}
            <div className="px-3 mb-10">
                <span className="text-text-primary text-2xl font-bold tracking-tight">AION</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1.5">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || item.label === activePage
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => NProgress.start()}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-150 btn-press ${isActive
                                ? 'text-accent-600 bg-accent-50 font-semibold border border-accent-200'
                                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover font-medium'
                                }`}
                        >
                            <item.icon className={`w-4.5 h-4.5 ${isActive ? 'text-accent-600' : 'text-text-subtle'}`} />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* AI Status */}
            <div className="px-3 pt-6 border-t border-border space-y-2">
                <div className="flex items-center gap-2.5 bg-status-successLight px-3 py-2.5 rounded-lg border border-status-success/20">
                    <span className="w-2 h-2 bg-status-success rounded-full" />
                    <span className="text-xs text-status-success font-semibold">AI Active</span>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-150 text-text-secondary hover:text-status-danger hover:bg-status-dangerLight font-medium btn-press"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    )
}
