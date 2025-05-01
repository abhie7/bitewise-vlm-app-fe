import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ChartComponentProps, NutritionItem } from '@/types'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function DailyCalorieTrend({ items }: ChartComponentProps) {
  const [chartData, setChartData] = useState<Array<{date: string, calories: number}>>([])

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

      setChartData(formattedData)
    }
  }, [items])

  return (
    <Card className="p-4 h-80">
      <CardContent className="p-0 h-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                domain={[0, 'auto']}
                label={{ value: 'Calories (kcal)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
              />
              <Tooltip formatter={(value: number) => [`${value} kcal`, 'Calories']} />
              <Area
                type="monotone"
                dataKey="calories"
                stroke="#f97316"
                fill="#fdba74"
                fillOpacity={0.6}
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
