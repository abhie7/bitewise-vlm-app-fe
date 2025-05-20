import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ChartComponentProps, NutritionItem } from '@/types'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { motion } from 'framer-motion'

export function DailyCalorieTrend({ items }: ChartComponentProps) {
  const [chartData, setChartData] = useState<Array<{date: string, calories: number}>>([])
  const [averageCalories, setAverageCalories] = useState(0)

  useEffect(() => {
    if (items && items.length > 0) {
      // Group by date and sum calories
      const dailyData: Record<string, number> = {}

      items.forEach((item: NutritionItem) => {
        const date = new Date(item.createdAt).toLocaleDateString()
        dailyData[date] = (dailyData[date] || 0) + item.calories
      })

      // Convert to chart data format
      const formattedData = Object.entries(dailyData)
        .map(([date, calories]) => ({ date, calories }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      // Calculate average calories
      const totalCalories = formattedData.reduce((sum, item) => sum + item.calories, 0)
      setAverageCalories(Math.round(totalCalories / formattedData.length))

      setChartData(formattedData)
    }
  }, [items])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background border rounded-lg shadow-lg p-3"
        >
          <p className="text-sm font-medium">{label}</p>
          <p className="text-lg font-bold text-orange-500">{payload[0].value} kcal</p>
        </motion.div>
      )
    }
    return null
  }

  return (
    <Card className="p-4 h-80">
      <CardContent className="p-0 h-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                }}
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                domain={[0, 'auto']}
                label={{
                  value: 'Calories (kcal)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: 12 }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={averageCalories}
                stroke="#f97316"
                strokeDasharray="3 3"
                label={{
                  value: 'Avg',
                  position: 'right',
                  fill: '#f97316',
                  fontSize: 12
                }}
              />
              <Area
                type="monotone"
                dataKey="calories"
                stroke="#f97316"
                fillOpacity={1}
                fill="url(#colorCalories)"
                animationBegin={0}
                animationDuration={1500}
              />
            </AreaChart>
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
