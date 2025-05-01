import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ChartComponentProps } from '@/types'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

export function MacroMicroChart({ items }: ChartComponentProps) {
  const [chartData, setChartData] = useState<Array<{name: string, value: number, color: string}>>([])

  useEffect(() => {
    if (items && items.length > 0) {
      // Aggregate macro and micro nutrients
      let totalMacro = 0
      let totalMicro = 0

      items.forEach(item => {
        // Add macros (protein, carbs, fat)
        totalMacro += item.protein + item.carbs + item.fat

        // Extract and add micros (sodium, calcium, iron, etc.)
        const nutrients = item.rawAnalysisData?.nutrients || {}

        Object.entries(nutrients).forEach(([key, value]) => {
          if (value && typeof value === 'object' && value.category === 'micronutrient') {
            totalMicro += value.amount || 0
          }
        })
      })

      setChartData([
        { name: 'Macronutrients', value: totalMacro, color: '#3b82f6' },
        { name: 'Micronutrients', value: totalMicro, color: '#10b981' }
      ])
    }
  }, [items])

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card className="p-4 h-80">
      <CardContent className="p-0 h-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={1500}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)}g`, 'Amount']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}