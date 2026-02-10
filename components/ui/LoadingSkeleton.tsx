import { motion } from 'framer-motion'

interface LoadingSkeletonProps {
    type: 'order' | 'product' | 'customer' | 'card' | 'table-row'
    count?: number
    animate?: boolean
}

const shimmer = {
    hidden: { backgroundPosition: '-200% 0' },
    visible: {
        backgroundPosition: '200% 0',
        transition: {
            repeat: Infinity,
            duration: 2,
            ease: 'linear',
        },
    },
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
}

const itemVariant = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 },
}

export default function LoadingSkeleton({ type, count = 5, animate = true }: LoadingSkeletonProps) {
    const shimmerClass = animate
        ? 'bg-gradient-to-r from-surface-base via-surface-hover to-surface-base bg-[length:200%_100%] animate-shimmer'
        : 'bg-surface-base'

    const renderSkeleton = () => {
        switch (type) {
            case 'order':
                return (
                    <div className="grid grid-cols-7 gap-4 py-4 px-6 items-center border-b border-border-subtle last:border-0">
                        <div className={`h-4 rounded w-16 ${shimmerClass}`} />
                        <div className="space-y-2">
                            <div className={`h-4 rounded w-32 ${shimmerClass}`} />
                            <div className={`h-3 rounded w-24 ${shimmerClass}`} />
                        </div>
                        <div className={`h-4 rounded w-20 ${shimmerClass}`} />
                        <div className={`h-6 rounded-full w-16 ${shimmerClass}`} />
                        <div className={`h-6 rounded-full w-20 ${shimmerClass}`} />
                        <div className={`h-4 rounded w-16 ${shimmerClass}`} />
                        <div className={`h-3 rounded w-20 ${shimmerClass}`} />
                    </div>
                )

            case 'product':
                return (
                    <div className="grid grid-cols-6 gap-4 py-4 px-6 items-center border-b border-border-subtle last:border-0">
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-lg ${shimmerClass}`} />
                            <div className="space-y-2 flex-1">
                                <div className={`h-4 rounded w-32 ${shimmerClass}`} />
                                <div className={`h-3 rounded w-24 ${shimmerClass}`} />
                            </div>
                        </div>
                        <div className={`h-4 rounded w-24 ${shimmerClass}`} />
                        <div className={`h-4 rounded w-20 ${shimmerClass}`} />
                        <div className={`h-6 rounded-full w-16 ${shimmerClass}`} />
                        <div className={`h-4 rounded w-16 ${shimmerClass}`} />
                        <div className={`h-3 rounded w-20 ${shimmerClass}`} />
                    </div>
                )

            case 'customer':
                return (
                    <div className="grid grid-cols-6 gap-4 py-4 px-6 items-center border-b border-border-subtle last:border-0">
                        <div className="col-span-2 flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${shimmerClass}`} />
                            <div className="space-y-2 flex-1">
                                <div className={`h-4 rounded w-32 ${shimmerClass}`} />
                                <div className={`h-3 rounded w-20 ${shimmerClass}`} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className={`h-4 rounded w-36 ${shimmerClass}`} />
                            <div className={`h-3 rounded w-28 ${shimmerClass}`} />
                        </div>
                        <div className={`h-4 rounded w-8 ${shimmerClass}`} />
                        <div className={`h-4 rounded w-16 ${shimmerClass}`} />
                        <div className={`h-3 rounded w-20 ${shimmerClass}`} />
                    </div>
                )

            case 'card':
                return (
                    <div className="bg-surface-main p-6 rounded-xl border border-border-subtle">
                        <div className={`h-3 rounded w-24 mb-3 ${shimmerClass}`} />
                        <div className={`h-8 rounded w-32 mb-2 ${shimmerClass}`} />
                        <div className={`h-3 rounded w-28 ${shimmerClass}`} />
                    </div>
                )

            case 'table-row':
                return (
                    <div className="py-4 px-6 border-b border-border-subtle last:border-0">
                        <div className="flex items-center gap-4">
                            <div className={`h-4 rounded w-24 ${shimmerClass}`} />
                            <div className={`h-4 rounded w-32 ${shimmerClass}`} />
                            <div className={`h-4 rounded w-20 ${shimmerClass}`} />
                            <div className={`h-4 rounded flex-1 ${shimmerClass}`} />
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    if (!animate) {
        return (
            <div className="divide-y divide-border-subtle">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i}>{renderSkeleton()}</div>
                ))}
            </div>
        )
    }

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="divide-y divide-border-subtle"
        >
            {Array.from({ length: count }).map((_, i) => (
                <motion.div key={i} variants={itemVariant}>
                    {renderSkeleton()}
                </motion.div>
            ))}
        </motion.div>
    )
}
