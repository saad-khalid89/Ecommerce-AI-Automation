'use client'

import { useState, useRef, useEffect } from 'react'
import { MoreVertical, LucideIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export interface MenuAction {
    label: string
    icon: LucideIcon
    onClick: () => void
    variant?: 'default' | 'danger' | 'success'
    disabled?: boolean
}

interface ContextMenuProps {
    actions: MenuAction[]
    align?: 'left' | 'right'
}

export default function ContextMenu({ actions, align = 'right' }: ContextMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const getVariantClasses = (variant?: string) => {
        switch (variant) {
            case 'danger':
                return 'text-status-danger hover:bg-status-dangerLight hover:text-status-danger'
            case 'success':
                return 'text-status-success hover:bg-status-successLight hover:text-status-success'
            default:
                return 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
        }
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(!isOpen)
                }}
                className="p-1.5 rounded-lg hover:bg-surface-hover text-text-subtle hover:text-text-secondary transition-colors"
            >
                <MoreVertical className="w-4 h-4" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute top-full mt-1 ${align === 'right' ? 'right-0' : 'left-0'} z-50 
                                    min-w-[180px] bg-surface-main rounded-xl shadow-lg border border-border-subtle 
                                    py-1 overflow-hidden`}
                    >
                        {actions.map((action, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (!action.disabled) {
                                        action.onClick()
                                        setIsOpen(false)
                                    }
                                }}
                                disabled={action.disabled}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                                          ${action.disabled
                                        ? 'opacity-50 cursor-not-allowed'
                                        : getVariantClasses(action.variant)
                                    }`}
                            >
                                <action.icon className="w-4 h-4" />
                                <span>{action.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
