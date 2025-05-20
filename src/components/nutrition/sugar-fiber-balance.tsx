import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ChartComponentProps } from '@/types'
import { motion } from 'framer-motion'
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts'

export function SugarFiberBalance({ items }: ChartComponentProps) {
  const [chartData, setChartData] = useState<Array<{
    name: string
    value: number
    fill: string
    score: number
  }>>([])

  useEffect(() => {
    if (items && items.length > 0) {
      const latestItem = items[0]
      const nutrients = latestItem.rawAnalysisData?.nutrients || {}

      // Calculate scores based on recommended daily values
      const scores = [
        {
          name: 'Protein',
          value: Math.min((nutrients.protein?.amount || 0) / 50 * 100, 100),
          fill: '#10b981',
          score: nutrients.protein?.amount || 0
        },
        {
          name: 'Fiber',
          value: Math.min((nutrients.carbohydrates?.sub_nutrients?.dietary_fiber?.amount || 0) / 28 * 100, 100),
          fill: '#3b82f6',
          score: nutrients.carbohydrates?.sub_nutrients?.dietary_fiber?.amount || 0
        },
        {
          name: 'Sugar',
          value: Math.min((nutrients.carbohydrates?.sub_nutrients?.total_sugar?.amount || 0) / 25 * 100, 100),
          fill: '#f97316',
          score: nutrients.carbohydrates?.sub_nutrients?.total_sugar?.amount || 0
        },
        {
          name: 'Fat',
          value: Math.min((nutrients.total_fat?.amount || 0) / 65 * 100, 100),
          fill: '#f59e0b',
          score: nutrients.total_fat?.amount || 0
        }
      ]

      setChartData(scores)
    }
  }, [items])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-background border rounded-lg shadow-lg p-3"
        >
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-lg font-bold" style={{ color: data.fill }}>
            {data.score.toFixed(1)}g ({data.value.toFixed(0)}% of DV)
          </p>
        </motion.div>
      )
    }
    return null
  }

  return (
    <Card className="p-4 h-80">
      <CardContent className="p-0 h-full">
        {chartData.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="30%"
                outerRadius="100%"
                data={chartData}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  minAngle={15}
                  background
                  clockWise={true}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-sm font-medium text-muted-foreground">Nutrient Balance</h3>
                <p className="text-2xl font-bold text-orange-500">
                  {Math.round(chartData.reduce((acc, curr) => acc + curr.value, 0) / chartData.length)}%
                </p>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
