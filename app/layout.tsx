import './globals.css'
import type { Metadata } from 'next'
import ToastProvider from '@/components/ui/ToastProvider'
import NavigationProgress from '@/components/NavigationProgress'

export const metadata: Metadata = {
    title: 'AION - AI Operations Manager',
    description: 'Primary operating system for ecommerce businesses',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <NavigationProgress />
                {children}
                <ToastProvider />
            </body>
        </html>
    )
}
