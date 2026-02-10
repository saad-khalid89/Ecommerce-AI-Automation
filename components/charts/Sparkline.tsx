'use client'

import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface SparklineProps {
    data: Array<{ value: number }>
    color?: string
}

export default function Sparkline({ data, color = '#10B981' }: SparklineProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
