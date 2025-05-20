import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts'
import type { ChartComponentProps, NutritionItem } from '@/types'

type RadarData = {
  subject: string
  fullMark: number
  [key: string]: number | string
}

export function MacronutrientRadarChart({ items }: ChartComponentProps) {
  const [chartData, setChartData] = useState<NutritionItem[]>([])

  useEffect(() => {
    if (items && items.length > 0) {
      // Prepare data for each food item
      const formattedData = items.map((item: NutritionItem) => {
        // Get nutrient values
        return {
          name: item.fileName.split('.')[0] || 'Item',
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          sugar: item.sugar,
          fiber: item.fiber,
          sodium:
            getValueFromAdditionalInfo(item.additionalInfo, 'Sodium') ||
            getNutrientAmount(item, 'sodium'),
          cholesterol:
            getValueFromAdditionalInfo(item.additionalInfo, 'Cholesterol') ||
            getNutrientAmount(item, 'cholesterol'),
          calcium:
            getValueFromAdditionalInfo(item.additionalInfo, 'Calcium') ||
            getNutrientAmount(item, 'calcium'),
          iron:
            getValueFromAdditionalInfo(item.additionalInfo, 'Iron') ||
            getNutrientAmount(item, 'iron'),
          potassium:
            getValueFromAdditionalInfo(item.additionalInfo, 'Potassium') ||
            getNutrientAmount(item, 'potassium'),
          magnesium:
            getValueFromAdditionalInfo(item.additionalInfo, 'Magnesium') ||
            getNutrientAmount(item, 'magnesium'),
          zinc:
            getValueFromAdditionalInfo(item.additionalInfo, 'Zinc') ||
            getNutrientAmount(item, 'zinc'),
          copper:
            getValueFromAdditionalInfo(item.additionalInfo, 'Copper') ||
            getNutrientAmount(item, 'copper'),
        }
      })

      setChartData(formattedData)
    }
  }, [items])

  // Helper to extract sodium or other values from additionalInfo
  const getValueFromAdditionalInfo = (
    additionalInfo: string,
    nutrientName: string
  ): number | null => {
    if (!additionalInfo) return null

    const regex = new RegExp(`${nutrientName}:\\s*(\\d+(?:\\.\\d+)?)`, 'i')
    const match = additionalInfo.match(regex)

    return match ? parseFloat(match[1]) : null
  }

  // Helper to get nutrient amount from rawAnalysisData
  const getNutrientAmount = (
    item: NutritionItem,
    nutrientKey: string
  ): number => {
    if (!item.rawAnalysisData?.nutrients) return 0

    const nutrient = item.rawAnalysisData.nutrients[nutrientKey]
    return nutrient && typeof nutrient === 'object' ? nutrient.amount || 0 : 0
  }

  // Create categories for the radar chart
  const categories = [
    { name: 'Protein', key: 'protein', fullMark: 30 },
    { name: 'Carbs', key: 'carbs', fullMark: 80 },
    { name: 'Fat', key: 'fat', fullMark: 40 },
    { name: 'Sugar', key: 'sugar', fullMark: 30 },
    { name: 'Fiber', key: 'fiber', fullMark: 10 },
    { name: 'Sodium', key: 'sodium', fullMark: 600 },
  ]

  // Format data for radar chart
  const radarData = categories.map((cat) => ({
    subject: cat.name,
    fullMark: cat.fullMark,
    ...chartData.reduce((acc, item, idx) => {
      acc[`item${idx + 1}`] = item[cat.key] || 0
      return acc
    }, {}),
  }))

  // Create a color array for the radar chart
  const COLORS = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff7300',
    '#ff0000',
    '#0088fe',
  ]

  return (
    <Card className='p-4 h-80'>
      <CardContent className='p-0 h-full'>
        {chartData.length > 0 ? (
          <ResponsiveContainer width='100%' height='100%'>
            <RadarChart
              data={radarData}
              margin={{ top: 10, right: 30, bottom: 10, left: 10 }}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey='subject' tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} />

              {chartData.map((_, idx) => (
                <Radar
                  key={`radar-${idx}`}
                  name={chartData[idx].name}
                  dataKey={`item${idx + 1}`}
                  stroke={COLORS[idx % COLORS.length]}
                  fill={COLORS[idx % COLORS.length]}
                  fillOpacity={0.3}
                />
              ))}

              {/* <Legend /> */}
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className='h-full flex items-center justify-center text-muted-foreground'>
            No data available for radar chart
          </div>
        )}
      </CardContent>
    </Card>
  )
}
