import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ChartComponentProps, NutritionItem } from '@/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

export function SugarFiberBalance({ items }: ChartComponentProps) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (items && items.length > 0) {
      // Format data for each item
      const formattedData = items.map((item: NutritionItem) => {
        const name = item.fileName.split('.')[0] || 'Item'
        return {
          name: name.length > 10 ? name.substring(0, 10) + '...' : name,
          sugar: item.sugar,
          fiber: item.fiber,
          ratio: item.fiber > 0 ? +(item.sugar / item.fiber).toFixed(2) : item.sugar > 0 ? 999 : 0,
        }
      })

      setChartData(formattedData)
    }
  }, [items])

  // Calculate the sugar to fiber ratio score
  const getSugarFiberRatioQuality = (ratio: number): string => {
    if (ratio === 0) return 'N/A'
    if (ratio < 1) return 'Excellent'
    if (ratio < 2) return 'Good'
    if (ratio < 5) return 'Fair'
    if (ratio < 10) return 'Poor'
    return 'Very Poor'
  }

  // Calculate average ratio across all items
  const averageRatio = chartData.length > 0
    ? chartData.reduce((sum, item) => sum + item.ratio, 0) / chartData.length
    : 0

  const ratioQuality = getSugarFiberRatioQuality(averageRatio)

  // Color based on quality
  const getQualityColor = (quality: string): string => {
    switch (quality) {
      case 'Excellent': return 'text-green-500'
      case 'Good': return 'text-teal-500'
      case 'Fair': return 'text-amber-500'
      case 'Poor': return 'text-orange-500'
      case 'Very Poor': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <Card className="p-4 h-80">
      <CardContent className="p-0 h-full">
        {chartData.length > 0 ? (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-medium">Sugar to Fiber Balance</h3>
                <p className="text-xs text-muted-foreground">Lower ratio is better</p>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`px-3 py-1 rounded-full text-xs font-medium ${getQualityColor(ratioQuality)} bg-muted`}
              >
                Average Ratio: {averageRatio.toFixed(2)} - {ratioQuality}
              </motion.div>
            </div>

            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      `${value}${name === 'ratio' ? '' : 'g'}`,
                      name.charAt(0).toUpperCase() + name.slice(1)
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="sugar" fill="#f87171" name="Sugar" animationBegin={0} animationDuration={1000} />
                  <Bar dataKey="fiber" fill="#4ade80" name="Fiber" animationBegin={300} animationDuration={1000} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No sugar or fiber data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
