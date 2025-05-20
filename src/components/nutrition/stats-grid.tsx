import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ChartComponentProps } from '@/types'
import { LayoutGrid, Croissant, Beef, BarChart3, Cookie, Flame, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function StatsGrid({ items, loading }: ChartComponentProps) {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalCalories: 0,
    averageCalories: 0,
    totalCarbs: 0,
    totalProtein: 0,
    totalFat: 0,
    weeklyTrend: [] as { date: string; shortDate: string; calories: number }[]
  })

  useEffect(() => {
    if (items && items.length > 0) {
      // Basic stats calculation
      const totalItems = items.length
      const totalCalories = items.reduce((sum, item) => sum + (item.calories || 0), 0)
      const totalCarbs = items.reduce((sum, item) => sum + (item.carbs || 0), 0)
      const totalProtein = items.reduce((sum, item) => sum + (item.protein || 0), 0)
      const totalFat = items.reduce((sum, item) => sum + (item.fat || 0), 0)

      // Create date objects for the last 7 days
      const today = new Date()
      today.setHours(23, 59, 59, 999) // End of today

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today)
        date.setDate(today.getDate() - (6 - i)) // 6 days ago to today

        // Format dates for display and comparison
        const month = date.getMonth() + 1
        const day = date.getDate()
        const formattedDate = `${month}/${day}`

        return {
          fullDate: date,
          dateForComparison: date.toISOString().split('T')[0], // YYYY-MM-DD format for comparison
          displayDate: formattedDate,
          shortDate: day.toString()
        }
      })

      // Group items by date and calculate daily calories
      const weeklyData = last7Days.map(dateObj => {
        // Filter items for this specific day
        const dayItems = items.filter(item => {
          if (!item.createdAt) return false

          const itemDate = new Date(item.createdAt)
          return itemDate.toISOString().split('T')[0] === dateObj.dateForComparison
        })

        // Calculate total calories for this day
        const dailyCalories = dayItems.reduce((sum, item) => sum + (item.calories || 0), 0)

        return {
          date: dateObj.displayDate,
          shortDate: dateObj.shortDate,
          calories: dailyCalories
        }
      })

      // Update state with calculated values
      setStats({
        totalItems,
        totalCalories,
        averageCalories: totalItems > 0 ? Math.round(totalCalories / totalItems) : 0,
        totalCarbs,
        totalProtein,
        totalFat,
        weeklyTrend: weeklyData
      })
    }
  }, [items])

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-2 text-foreground">
          <p className="text-xs font-medium">{payload[0].payload.date}</p>
          <p className="text-sm font-bold text-orange-500">{payload[0].value} kcal</p>
        </div>
      )
    }
    return null
  }

  // Stat card configuration
  const statCards = [
    {
      title: 'Total Items',
      value: stats.totalItems,
      icon: LayoutGrid,
      color: 'bg-blue-500/10 text-blue-500',
      formatted: `${stats.totalItems} ${stats.totalItems === 1 ? 'item' : 'items'}`
    },
    {
      title: 'Total Calories',
      value: stats.totalCalories,
      icon: Flame,
      color: 'bg-orange-500/10 text-orange-500',
      formatted: `${stats.totalCalories.toLocaleString()} kcal`,
      trend: true
    },
    {
      title: 'Avg. Calories',
      value: stats.averageCalories,
      icon: BarChart3,
      color: 'bg-amber-500/10 text-amber-500',
      formatted: `${stats.averageCalories.toLocaleString()} kcal`
    },
    {
      title: 'Total Carbs',
      value: stats.totalCarbs,
      icon: Croissant,
      color: 'bg-yellow-500/10 text-yellow-500',
      formatted: `${stats.totalCarbs.toFixed(1)}g`
    },
    {
      title: 'Total Protein',
      value: stats.totalProtein,
      icon: Beef,
      color: 'bg-green-500/10 text-green-500',
      formatted: `${stats.totalProtein.toFixed(1)}g`
    },
    {
      title: 'Total Fat',
      value: stats.totalFat,
      icon: Cookie,
      color: 'bg-red-500/10 text-red-500',
      formatted: `${stats.totalFat.toFixed(1)}g`
    }
  ]

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="overflow-hidden bg-card relative group hover:shadow-md transition-shadow duration-300 gap-2 py-2">
          <CardContent className="p-4">
            {loading ? (
              <CardSkeleton />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-full ${stat.color}`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                  {stat.trend && stats.weeklyTrend.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: '9rem' }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="h-10"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.weeklyTrend}>
                          <XAxis
                            dataKey="shortDate"
                            tick={false}
                            axisLine={false}
                            tickLine={false}
                            height={0}
                          />
                          <YAxis hide domain={['dataMin', 'dataMax']} />
                          <Line
                            type="monotone"
                            dataKey="calories"
                            stroke="#f97316"
                            strokeWidth={4}
                            dot={false}
                            isAnimationActive={true}
                            animationDuration={500}
                          />
                          <Tooltip content={<CustomTooltip />} />
                        </LineChart>
                      </ResponsiveContainer>
                    </motion.div>
                  )}
                </div>
                <h3 className="text-md font-medium text-muted-foreground">{stat.title}</h3>
                <p className="text-2xl font-bold mt-1">{stat.formatted}</p>

                {/* Mobile hover effect for trend card */}
                {stat.trend && stats.weeklyTrend.length > 0 && (
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Skeleton component for loading state
function CardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-16 rounded" />
      </div>
      <Skeleton className="h-4 w-20 mb-1" />
      <Skeleton className="h-6 w-16 mt-1" />
    </div>
  )
}