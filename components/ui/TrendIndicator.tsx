'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface TrendIndicatorProps {
    value: number
    label?: string
    showIcon?: boolean
    size?: 'sm' | 'md' | 'lg'
}

export default function TrendIndicator({
    value,
    label = 'vs last period',
    showIcon = true,
    size = 'md'
}: TrendIndicatorProps) {
    const isPositive = value > 0
    const isNeutral = value === 0

    const sizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    }

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    }

    return (
        <div className={`flex items-center gap-1.5 ${sizeClasses[size]}`}>
            {showIcon && (
                <span className={`flex-shrink-0 ${isNeutral
                        ? 'text-text-subtle'
                        : isPositive
                            ? 'text-status-success'
                            : 'text-status-danger'
                    }`}>
                    {isNeutral ? (
                        <Minus className={iconSizes[size]} />
                    ) : isPositive ? (
                        <TrendingUp className={iconSizes[size]} />
                    ) : (
                        <TrendingDown className={iconSizes[size]} />
                    )}
                </span>
            )}
            <span className={`font-semibold ${isNeutral
                    ? 'text-text-subtle'
                    : isPositive
                        ? 'text-status-success'
                        : 'text-status-danger'
                }`}>
                {isPositive && '+'}{value.toFixed(1)}%
            </span>
            {label && (
                <span className="text-text-subtle font-normal">
                    {label}
                </span>
            )}
        </div>
    )
}
