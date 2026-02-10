import { motion } from 'framer-motion'

interface EmptyStateProps {
    icon?: React.ReactNode
    title: string
    description: string
    action?: {
        label: string
        onClick: () => void
    }
    illustration?: 'orders' | 'products' | 'customers' | 'search' | 'filter'
}

const illustrations = {
    orders: (
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="40" y="30" width="120" height="100" rx="8" fill="currentColor" opacity="0.1" />
            <rect x="60" y="50" width="80" height="8" rx="4" fill="currentColor" opacity="0.2" />
            <rect x="60" y="70" width="60" height="8" rx="4" fill="currentColor" opacity="0.2" />
            <rect x="60" y="90" width="50" height="8" rx="4" fill="currentColor" opacity="0.2" />
            <circle cx="70" cy="110" r="15" fill="currentColor" opacity="0.15" />
            <path d="M65 110 L68 113 L75 106" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
        </svg>
    ),
    products: (
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="50" y="40" width="100" height="80" rx="8" fill="currentColor" opacity="0.1" />
            <rect x="70" y="55" width="60" height="40" rx="4" fill="currentColor" opacity="0.15" />
            <rect x="80" y="100" width="40" height="6" rx="3" fill="currentColor" opacity="0.2" />
            <rect x="75" y="110" width="50" height="6" rx="3" fill="currentColor" opacity="0.2" />
        </svg>
    ),
    customers: (
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="70" r="25" fill="currentColor" opacity="0.15" />
            <path d="M65 115 Q65 95 100 95 Q135 95 135 115" fill="currentColor" opacity="0.1" />
            <circle cx="100" cy="60" r="15" fill="currentColor" opacity="0.2" />
        </svg>
    ),
    search: (
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="90" cy="70" r="30" stroke="currentColor" strokeWidth="4" opacity="0.2" fill="none" />
            <line x1="112" y1="92" x2="135" y2="115" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.2" />
            <line x1="70" y1="60" x2="110" y2="60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.15" />
            <line x1="70" y1="70" x2="100" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.15" />
            <line x1="70" y1="80" x2="95" y2="80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.15" />
        </svg>
    ),
    filter: (
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 50 L140 50 L110 90 L110 120 L90 120 L90 90 Z" fill="currentColor" opacity="0.15" />
            <circle cx="80" cy="50" r="6" fill="currentColor" opacity="0.25" />
            <circle cx="120" cy="50" r="6" fill="currentColor" opacity="0.25" />
        </svg>
    ),
}

export default function EmptyState({ icon, title, description, action, illustration = 'search' }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center p-12 text-center"
        >
            {/* Illustration */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="text-text-subtle mb-6"
            >
                {icon || illustrations[illustration]}
            </motion.div>

            {/* Title */}
            <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-text-primary text-lg font-semibold mb-2"
            >
                {title}
            </motion.h3>

            {/* Description */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-text-muted text-sm mb-6 max-w-sm"
            >
                {description}
            </motion.p>

            {/* Action Button */}
            {action && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={action.onClick}
                    className="px-6 py-2.5 bg-accent-primary hover:bg-accent-hover text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                    {action.label}
                </motion.button>
            )}
        </motion.div>
    )
}
