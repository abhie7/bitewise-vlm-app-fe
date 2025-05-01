import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ChartComponentProps, NutritionItem } from '@/types'
import { TagCloud } from 'react-tagcloud'
import { motion } from 'framer-motion'

interface WordCloudData {
  value: string
  count: number
  color?: string
}

export function IngredientWordCloud({ items }: ChartComponentProps) {
  const [cloudData, setCloudData] = useState<WordCloudData[]>([])

  useEffect(() => {
    if (items && items.length > 0) {
      // Extract all ingredients from items
      const ingredientFrequency: Record<string, number> = {}

      items.forEach((item: NutritionItem) => {
        if (item.rawAnalysisData?.ingredients && Array.isArray(item.rawAnalysisData.ingredients)) {
          item.rawAnalysisData.ingredients.forEach(ingredient => {
            // Clean up ingredient name
            const cleanName = ingredient.trim().replace(/\([^)]*\)/g, '').trim()
            ingredientFrequency[cleanName] = (ingredientFrequency[cleanName] || 0) + 1
          })
        }
      })

      // Convert to word cloud format
      const wordData = Object.entries(ingredientFrequency)
        .map(([value, count]) => ({
          value,
          count: count > 0 ? count : 1
        }))
        .filter(item => item.value.length > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 30) // Limit to top 30 ingredients

      setCloudData(wordData)
    }
  }, [items])

  // Define color options
  const colorOptions = {
    luminosity: 'bright',
    hue: 'blue',
  }

  // Custom renderer for tags
  const customRenderer = (tag: WordCloudData, size: number, color: string) => (
    <motion.span
      key={tag.value}
      style={{
        fontSize: `${size}px`,
        margin: '3px',
        padding: '3px',
        display: 'inline-block',
        color: color,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {tag.value}
    </motion.span>
  )

  return (
    <Card className="p-4 h-80">
      <CardContent className="p-0 h-full">
        {cloudData.length > 0 ? (
          <div className="h-full flex items-center justify-center overflow-hidden">
            <TagCloud
              minSize={14}
              maxSize={40}
              tags={cloudData}
              colorOptions={colorOptions}
              renderer={customRenderer}
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No ingredient data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
