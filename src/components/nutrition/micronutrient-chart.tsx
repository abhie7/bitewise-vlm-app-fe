import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ChartComponentProps, NutritionItem } from '@/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts'

export function MicronutrientChart({ items }: ChartComponentProps) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (items && items.length > 0) {
      // Extract and aggregate micronutrients
      const micronutrients: Record<string, { amount: number, unit: string, dailyValue: number | null }> = {}

      items.forEach((item: NutritionItem) => {
        const nutrients = item.rawAnalysisData?.nutrients || {}

        Object.entries(nutrients).forEach(([key, value]) => {
          if (value && typeof value === 'object' && value.category === 'micronutrient') {
            const name = formatNutrientName(key)

            if (!micronutrients[name]) {
              micronutrients[name] = {
                amount: 0,
                unit: value.unit || 'mg',
                dailyValue: value.daily_value_percentage
              }
            }

            micronutrients[name].amount += value.amount || 0

            // If this item has a daily value and previous didn't, update it
            if (value.daily_value_percentage && !micronutrients[name].dailyValue) {
              micronutrients[name].dailyValue = value.daily_value_percentage
            }
          }
        })

        // Also check additionalInfo for sodium or other nutrients
        if (item.additionalInfo) {
          const sodiumMatch = item.additionalInfo.match(/Sodium:\s*(\d+)mg/i)
          if (sodiumMatch && sodiumMatch[1]) {
            const sodiumAmount = parseInt(sodiumMatch[1])

            if (!micronutrients['Sodium']) {
              micronutrients['Sodium'] = {
                amount: 0,
                unit: 'mg',
                dailyValue: null
              }
            }

            micronutrients['Sodium'].amount += sodiumAmount
          }
        }
      })

      // Format for chart
      const formattedData = Object.entries(micronutrients)
        .map(([name, data]) => ({
          name,
          amount: data.amount,
          unit: data.unit,
          dailyValue: data.dailyValue
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 8) // Take top 8 micronutrients

      setChartData(formattedData)
    }
  }, [items])

  // Format nutrient name for display
  const formatNutrientName = (name: string): string => {
    return name
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Colors based on nutrient type
  const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300',
    '#0088fe', '#00C49F', '#FFBB28', '#FF8042'
  ]

  return (
    <Card className="p-4 h-80">
      <CardContent className="p-0 h-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 20, right: 50, left: 60, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.2} />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value, name, props) => {
                  const item = props.payload;
                  const dailyValueText = item.dailyValue
                    ? ` (${item.dailyValue}% DV)`
                    : '';
                  return [`${value} ${item.unit}${dailyValueText}`, name];
                }}
              />
              <Legend />
              <Bar
                dataKey="amount"
                name="Amount"
                animationBegin={0}
                animationDuration={1500}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <LabelList dataKey="unit" position="right" style={{ textAnchor: 'start', fill: '#666', fontSize: 12 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No micronutrient data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
