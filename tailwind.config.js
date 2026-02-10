/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                // Professional SaaS Palette - Simplified & Refined
                surface: {
                    base: '#F9FAFB',      // Page background
                    elevated: '#FFFFFF',  // Cards & panels
                    hover: '#F3F4F6',     // Hover states
                },
                text: {
                    primary: '#111827',   // Headings & important text
                    secondary: '#6B7280', // Body text
                    tertiary: '#9CA3AF',  // Labels & subtle text
                },
                accent: {
                    50: '#ECFDF5',
                    100: '#D1FAE5',
                    200: '#A7F3D0',
                    300: '#6EE7B7',
                    400: '#34D399',
                    500: '#10B981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065F46',
                    900: '#064E3B',
                    primary: '#10B981',   // Primary action color
                    hover: '#059669',     // Primary hover state
                    light: '#ECFDF5',     // Light backgrounds
                },
                status: {
                    success: '#10B981',
                    successLight: '#ECFDF5',
                    danger: '#EF4444',
                    dangerLight: '#FEF2F2',
                    warning: '#F59E0B',
                    warningLight: '#FFFBEB',
                    info: '#3B82F6',
                    infoLight: '#EFF6FF',
                },
                border: {
                    DEFAULT: '#E5E7EB',   // Standard border
                    light: '#F3F4F6',     // Very light border
                    dark: '#D1D5DB',      // Emphasized border
                },
            },
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1.5' }],      // 12px
                'sm': ['0.875rem', { lineHeight: '1.5' }],     // 14px - most UI text
                'base': ['1rem', { lineHeight: '1.6' }],       // 16px - body text
                'lg': ['1.125rem', { lineHeight: '1.5' }],     // 18px
                'xl': ['1.25rem', { lineHeight: '1.4' }],      // 20px
                '2xl': ['1.5rem', { lineHeight: '1.3' }],      // 24px - page titles
                'kpi': ['2rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em' }],
            },
            letterSpacing: {
                'tight': '-0.02em',  // For headings only
            },
            boxShadow: {
                'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',                                    // Subtle elements
                'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',  // Cards
                'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',    // Elevated cards
                'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',  // Dropdowns/modals
            },
        },
    },
    plugins: [],
}
