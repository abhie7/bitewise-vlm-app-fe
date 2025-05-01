import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ChartComponentProps, NutritionItem } from '@/types'
import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar'
import { motion } from 'framer-motion'

export function NutrientQualityGauge({ items }: ChartComponentProps) {
  const [qualityScore, setQualityScore] = useState(0)
  const [qualityCategory, setQualityCategory] = useState('')
  const [scoreDetails, setScoreDetails] = useState<{
    proteinScore: number;
    fiberScore: number;
    sugarScore: number;
    fatScore: number;
  }>({
    proteinScore: 0,
    fiberScore: 0,
    sugarScore: 0,
    fatScore: 0
  })

  useEffect(() => {
    if (items && items.length > 0) {
      // Calculate total nutrients across all items
      const totalCalories = items.reduce((sum, item) => sum + item.calories, 0)
      const totalProtein = items.reduce((sum, item) => sum + item.protein, 0)
      const totalFiber = items.reduce((sum, item) => sum + item.fiber, 0)
      const totalSugar = items.reduce((sum, item) => sum + item.sugar, 0)
      const totalFat = items.reduce((sum, item) => sum + item.fat, 0)

      // Calculate quality scores
      // 1. Protein Score (0-30) - Target: 0.8g per 100 calories
      const proteinRatio = totalCalories > 0 ? (totalProtein / totalCalories) * 100 : 0
      const proteinScore = Math.min(30, Math.round(proteinRatio / 0.8 * 30))

      // 2. Fiber Score (0-25) - Target: 14g per 1000 calories
      const fiberRatio = totalCalories > 0 ? (totalFiber / totalCalories) * 1000 : 0
      const fiberScore = Math.min(25, Math.round(fiberRatio / 14 * 25))

      // 3. Sugar Score (0-25) - Target: Low sugar (reverse scale)
      const sugarRatio = totalCalories > 0 ? (totalSugar / totalCalories) * 100 : 0
      const sugarScore = Math.max(0, Math.min(25, Math.round(25 - (sugarRatio * 5))))

      // 4. Fat Quality Score (0-20) - Evaluating fat composition
      // Simplified version - based on total fat ratio
      const fatRatio = totalCalories > 0 ? (totalFat * 9 / totalCalories) * 100 : 0 // 9 calories per gram of fat
      const fatScore = Math.max(0, Math.min(20, Math.round(20 - Math.abs(fatRatio - 30) / 2)))

      // Calculate total score (0-100)
      const totalScore = proteinScore + fiberScore + sugarScore + fatScore

      // Determine quality category
      let category = 'Poor'
      if (totalScore >= 80) category = 'Excellent'
      else if (totalScore >= 65) category = 'Very Good'
      else if (totalScore >= 50) category = 'Good'
      else if (totalScore >= 35) category = 'Fair'

      setQualityScore(totalScore)
      setQualityCategory(category)
      setScoreDetails({
        proteinScore,
        fiberScore,
        sugarScore,
        fatScore
      })
    }
  }, [items])

  // Determine color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'hsl(142, 76%, 36%)' // Green
    if (score >= 65) return 'hsl(142, 71%, 45%)' // Light Green
    if (score >= 50) return 'hsl(48, 96%, 53%)' // Yellow
    if (score >= 35) return 'hsl(38, 92%, 50%)' // Orange
    return 'hsl(0, 84%, 60%)' // Red
  }

  // Get neutral color for gauge background
  const getBackgroundColor = (score: number): string => {
    if (score >= 80) return 'hsl(142, 76%, 88%)'
    if (score >= 65) return 'hsl(142, 71%, 90%)'
    if (score >= 50) return 'hsl(48, 96%, 90%)'
    if (score >= 35) return 'hsl(38, 92%, 90%)'
    return 'hsl(0, 84%, 90%)'
  }

  const categoryStyle = {
    transform: `translateX(-50%)`,
    bottom: '40px',
    left: '50%',
    position: 'absolute' as const,
  }

  return (
    <Card className="p-4 h-80">
      <CardContent className="p-0 h-full">
        <div className="h-full flex flex-col items-center justify-center">
          <h3 className="text-lg font-medium mb-4">Nutrition Quality Score</h3>

          <div className="relative">
            <AnimatedCircularProgressBar
              max={100}
              value={qualityScore}
              min={0}
              gaugePrimaryColor={getScoreColor(qualityScore)}
              gaugeSecondaryColor={getBackgroundColor(qualityScore)}
              className="w-40 h-40 text-xl"
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={categoryStyle}
              className={`text-lg font-semibold ${qualityScore >= 50 ? 'text-green-600' : qualityScore >= 35 ? 'text-amber-600' : 'text-red-600'}`}
            >
              {qualityCategory}
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-xs">Protein: {scoreDetails.proteinScore}/30</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-xs">Fiber: {scoreDetails.fiberScore}/25</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-xs">Sugar: {scoreDetails.sugarScore}/25</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
              <span className="text-xs">Fats: {scoreDetails.fatScore}/20</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
