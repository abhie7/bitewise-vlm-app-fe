import { Card, CardContent } from '@/components/ui/card'
import { ChartComponentProps } from '@/types'
import { LayoutGrid, Croissant , Beef , BarChart3, Cookie , Flame } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function StatsGrid({ items, loading }: ChartComponentProps) {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalCalories: 0,
    averageCalories: 0,
    totalCarbs: 0,
    totalProtein: 0,
    totalFat: 0
  })

  useEffect(() => {
    if (items && items.length > 0) {
      const totalItems = items.length
      const totalCalories = items.reduce((sum, item) => sum + item.calories, 0)
      const totalCarbs = items.reduce((sum, item) => sum + item.carbs, 0)
      const totalProtein = items.reduce((sum, item) => sum + item.protein, 0)
      const totalFat = items.reduce((sum, item) => sum + item.fat, 0)

      setStats({
        totalItems,
        totalCalories,
        averageCalories: Math.round(totalCalories / totalItems),
        totalCarbs,
        totalProtein,
        totalFat
      })
    }
  }, [items])

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
      formatted: `${stats.totalCalories} kcal`
    },
    {
      title: 'Avg. Calories',
      value: stats.averageCalories,
      icon: BarChart3,
      color: 'bg-amber-500/10 text-amber-500',
      formatted: `${stats.averageCalories} kcal`
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
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className={`p-3 rounded-full ${stat.color} mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
              <p className="text-2xl font-bold mt-1">{loading ? '—' : stat.formatted}</p>
            </motion.div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
