'use client'

import { Toaster } from 'sonner'

export default function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                style: {
                    background: 'var(--surface-main)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                },
                className: 'toaster-custom',
                duration: 3000,
            }}
            richColors
        />
    )
}
