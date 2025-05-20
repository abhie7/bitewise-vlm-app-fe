import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { motion } from 'framer-motion'
import type { NutritionItem } from '@/services/nutritionService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type MacroMicroChartProps = {
  items: NutritionItem[]
}

type ChartData = {
  name: string
  value: number
  color: string
  percentage: number
}

const COLORS = {
  macros: {
    protein: '#FF6B6B',
    carbs: '#4ECDC4',
    fat: '#FFD93D'
  },
  micros: {
    sodium: '#6C5CE7',
    calcium: '#00B894',
    iron: '#E17055',
    cholesterol: '#FDCB6E'
  }
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-white p-3 rounded-lg shadow-lg border border-gray-200"
      >
        <p className="font-semibold text-gray-800">{data.name}</p>
        <p className="text-sm text-gray-600">{data.value.toFixed(1)}g</p>
        <p className="text-xs text-gray-500">{data.percentage.toFixed(1)}% of total</p>
      </motion.div>
    )
  }
  return null
}

export const MacroMicroChart = ({ items }: MacroMicroChartProps) => {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    const calculateNutrients = () => {
      const macroNutrients = items.reduce((acc, item) => ({
        protein: (acc.protein || 0) + item.protein,
        carbs: (acc.carbs || 0) + item.carbs,
        fat: (acc.fat || 0) + item.fat
      }), {} as Record<string, number>)

      const microNutrients = items.reduce((acc, item) => {
        const nutrients = item.rawAnalysisData.nutrients
        return {
          sodium: (acc.sodium || 0) + (nutrients.sodium?.amount || 0),
          calcium: (acc.calcium || 0) + (nutrients.calcium?.amount || 0),
          iron: (acc.iron || 0) + (nutrients.iron?.amount || 0),
          cholesterol: (acc.cholesterol || 0) + (nutrients.cholesterol?.amount || 0)
        }
      }, {} as Record<string, number>)

      const totalMacros = Object.values(macroNutrients).reduce((sum, val) => sum + val, 0)
      const totalMicros = Object.values(microNutrients).reduce((sum, val) => sum + val, 0)

      const data: ChartData[] = [
        ...Object.entries(macroNutrients).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          color: COLORS.macros[name as keyof typeof COLORS.macros],
          percentage: (value / totalMacros) * 100
        })),
        ...Object.entries(microNutrients).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          color: COLORS.micros[name as keyof typeof COLORS.micros],
          percentage: (value / totalMicros) * 100
        }))
      ]

      setChartData(data)
    }

    calculateNutrients()
  }, [items])

  return (
    <Card className="p-4 h-80">
      <CardHeader>
        <CardTitle>Nutrient Distribution</CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{
                      filter: activeIndex === index ? 'brightness(1.1)' : 'brightness(1)',
                      transition: 'filter 0.2s ease'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        )}
      </CardContent>

      {/* Legend outside the chart content for clean separation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-5 gap-2 mt-0 px-2"
      >
        {chartData.map((entry, index) => (
          <motion.div
            key={entry.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center space-x-2"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  )
}
