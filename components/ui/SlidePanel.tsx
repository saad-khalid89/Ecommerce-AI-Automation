'use client'

import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface SlidePanelProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    width?: 'sm' | 'md' | 'lg' | 'xl'
}

const widthClasses = {
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[420px]',
    xl: 'w-[520px]',
}

export default function SlidePanel({
    isOpen,
    onClose,
    title,
    children,
    width = 'lg',
}: SlidePanelProps) {
    const panelRef = useRef<HTMLDivElement>(null)

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    // Click outside to close
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose()
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex justify-end"
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-md transition-all duration-300" />

            {/* Panel */}
            <div
                ref={panelRef}
                className={`relative ${widthClasses[width]} h-full bg-white border-l border-border flex flex-col shadow-lg`}
                style={{
                    animation: 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-white">
                    <h2 className="text-text-primary text-base font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-text-tertiary hover:text-text-primary transition-all duration-150 p-2 rounded-lg hover:bg-surface-hover btn-press"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>

            <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0.95;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    )
}
