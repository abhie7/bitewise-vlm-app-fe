import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/ui/credenza'
import { Button } from '@/components/ui/button'
import { NutritionResult } from '@/sockets/socketClient'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Download,
  ChevronRight,
  ChevronLeft,
  Copy,
  Utensils,
  Flame,
  Wheat,
  Egg,
  Cookie,
  Beef,
  Share2,
  Check,
  Croissant,
} from 'lucide-react'
// import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar'

// Array of nutrition quotes
const NUTRITION_QUOTES = [
  'Let food be thy medicine, thy medicine shall be thy food. — Hippocrates',
  "You are what you eat, so don't be fast, cheap, easy, or fake. — Unknown",
  'The food you eat can be either the safest and most powerful form of medicine or the slowest form of poison. — Ann Wigmore',
  "Take care of your body. It's the only place you have to live. — Jim Rohn",
  'Your diet is a bank account. Good food choices are good investments. — Bethenny Frankel',
  'Health is not about the weight you lose, but about the life you gain. — Unknown',
  'The greatest wealth is health. — Virgil',
  'If you keep good food in your fridge, you will eat good food. — Errick McAdams',
  "Don't eat anything your great-grandmother wouldn't recognize as food. — Michael Pollan",
  'Tell me what you eat, and I will tell you what you are. — Anthelme Brillat-Savarin',
]

interface NutritionResultModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  result: (NutritionResult & { rawData?: any }) | null
}

export function NutritionResultModal({
  open,
  onOpenChange,
  result,
}: NutritionResultModalProps) {
  const [activeTab, setActiveTab] = useState('summary')
  const [copied, setCopied] = useState(false)
  const [quoteIndex, setQuoteIndex] = useState(
    Math.floor(Math.random() * NUTRITION_QUOTES.length)
  )

  // If there's raw data with nutrients that can be paginated
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 5

  if (!result) return null

  // Get a random quote from the array
  const randomQuote = NUTRITION_QUOTES[quoteIndex]

  // For raw data pagination (handling additional nutrients if available)
  const additionalNutrients = result.rawData?.nutrients
    ? Object.entries(result.rawData.nutrients)
        .filter(
          ([key]) => !['total_fat', 'carbohydrates', 'protein'].includes(key)
        )
        .map(([key, value]: [string, any]) => ({
          name: formatNutrientName(key),
          value,
        }))
    : []

  const totalPages = Math.ceil(additionalNutrients.length / itemsPerPage)
  const currentNutrients = additionalNutrients.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  // Calculate macro percentages for the donut chart
  const totalMacros = result.carbs + result.protein + result.fat
  const carbPercent =
    totalMacros > 0 ? Math.round((result.carbs / totalMacros) * 100) : 0
  const proteinPercent =
    totalMacros > 0 ? Math.round((result.protein / totalMacros) * 100) : 0
  const fatPercent =
    totalMacros > 0 ? Math.round((result.fat / totalMacros) * 100) : 0

  // Format nutrition values
  const formatValue = (value: number, unit: string = 'g') => {
    return `${value}${unit}`
  }

  // Generate calorie quality badge
  const getCalorieQuality = () => {
    if (result.protein > 20 && result.fiber > 5 && result.sugar < 10)
      return 'Excellent'
    if (result.protein > 15 && result.fiber > 3) return 'Good'
    if (result.sugar > 15 && result.fat > 15) return 'Poor'
    return 'Average'
  }

  // Handle copying nutrition data to clipboard
  const handleCopyToClipboard = () => {
    const textToCopy = `
Nutrition Information for ${result.foodName}:
• Calories: ${result.calories} kcal
• Carbohydrates: ${result.carbs}g
• Protein: ${result.protein}g
• Fat: ${result.fat}g
• Sugar: ${result.sugar}g
• Fiber: ${result.fiber}g
${result.additionalInfo ? '\nAdditional Info:\n' + result.additionalInfo : ''}
    `.trim()

    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Format nutrient names to be more readable
  function formatNutrientName(name: string): string {
    return name
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Change to the next quote
  const nextQuote = () => {
    setQuoteIndex((prevIndex) =>
      prevIndex === NUTRITION_QUOTES.length - 1 ? 0 : prevIndex + 1
    )
  }

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      <CredenzaContent className='sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] xl:max-w-5xl p-0 overflow-hidden'>
        <div className='absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500' />

        <CredenzaHeader className='px-6 pt-6 pb-2'>
          <div className='flex items-center justify-between'>
            <div>
              <CredenzaTitle className='text-2xl font-bold'>
                <span className='mr-2'>🍽️</span>
                Nutrition Analysis Results
              </CredenzaTitle>
              <CredenzaDescription className='text-lg font-medium mt-1'>
                {result.foodName}
              </CredenzaDescription>
            </div>
            <Badge
              variant={
                getCalorieQuality() === 'Excellent'
                  ? 'default'
                  : getCalorieQuality() === 'Good'
                  ? 'outline'
                  : getCalorieQuality() === 'Poor'
                  ? 'destructive'
                  : 'secondary'
              }
              className='text-sm py-1.5'
            >
              {getCalorieQuality()} Quality
            </Badge>
          </div>
        </CredenzaHeader>

        <Tabs
          defaultValue='summary'
          value={activeTab}
          onValueChange={setActiveTab}
          className='w-full'
        >
          <div className='px-6'>
            <TabsList className='w-full justify-start mb-4'>
              <TabsTrigger value='summary' className='text-sm'>
                Summary
              </TabsTrigger>
              <TabsTrigger value='macros' className='text-sm'>
                Macronutrients
              </TabsTrigger>
              <TabsTrigger value='details' className='text-sm'>
                Detailed Info
              </TabsTrigger>
              {result.rawData && (
                <TabsTrigger value='raw' className='text-sm'>
                  Raw Data
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <CredenzaBody className='p-6 pt-2 max-h-[calc(80vh-170px)] overflow-y-auto'>
            <TabsContent value='summary' className='mt-0 space-y-4'>
              {/* Calorie Card */}
              <Card className='overflow-hidden'>
                <div className='bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950 dark:to-amber-950 p-2'>
                  <h3 className='text-lg font-semibold px-2'>
                    Caloric Information
                  </h3>
                </div>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <Flame className='w-10 h-10 text-orange-500 mr-4' />
                      <div>
                        <h4 className='text-sm font-medium text-muted-foreground'>
                          Total Calories
                        </h4>
                        <p className='text-3xl font-bold'>{result.calories}</p>
                      </div>
                    </div>

                    <motion.div
                      className='text-xl font-semibold flex items-center gap-2 p-3 rounded-full bg-amber-100 dark:bg-amber-950'
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                    >
                      <span>{carbPercent}%</span> /{' '}
                      <span>{proteinPercent}%</span> /{' '}
                      <span>{fatPercent}%</span>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              {/* Main Nutrients Grid */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {/* Carbs Card */}
                <Card>
                  <CardContent className='p-4 flex flex-col items-center'>
                    <div className='flex items-center mb-2'>
                      <Wheat className='w-8 h-8 text-amber-500 mr-3' />
                      <div>
                        <h3 className='text-sm font-medium text-muted-foreground'>
                          Carbohydrates
                        </h3>
                        <div className='flex items-baseline gap-1.5'>
                          <p className='text-2xl font-bold'>{result.carbs}</p>
                          <span className='text-muted-foreground text-sm'>g</span>
                        </div>
                      </div>
                    </div>

                    <AnimatedCircularProgressBar
                      max={Math.max(50, result.carbs * 1.5)} // Scale max to create context
                      value={result.carbs}
                      min={0}
                      gaugePrimaryColor="hsl(43, 96%, 58%)" // Amber for carbs
                      gaugeSecondaryColor="hsl(43, 96%, 88%)"
                      className="my-2 w-28 h-28 text-lg"
                    />

                    <div className='w-full grid grid-cols-2 gap-3 mt-2'>
                      <div className='flex flex-col items-center'>
                        <span className='text-xs text-muted-foreground mb-1'>Sugar</span>
                        <span className='text-sm font-bold'>{result.sugar}g</span>
                      </div>
                      <div className='flex flex-col items-center'>
                        <span className='text-xs text-muted-foreground mb-1'>Fiber</span>
                        <span className='text-sm font-bold'>{result.fiber}g</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Protein Card */}
                <Card>
                  <CardContent className='p-4 flex flex-col items-center'>
                    <div className='flex items-center mb-2'>
                      <Beef className='w-8 h-8 text-blue-500 mr-3' />
                      <div>
                        <h3 className='text-sm font-medium text-muted-foreground'>
                          Protein
                        </h3>
                        <div className='flex items-baseline gap-1.5'>
                          <p className='text-2xl font-bold'>{result.protein}</p>
                          <span className='text-muted-foreground text-sm'>g</span>
                        </div>
                      </div>
                    </div>

                    <AnimatedCircularProgressBar
                      max={Math.max(30, result.protein * 1.5)} // Scale max to create context
                      value={result.protein}
                      min={0}
                      gaugePrimaryColor="hsl(217, 91%, 60%)" // Blue for protein
                      gaugeSecondaryColor="hsl(217, 91%, 90%)"
                      className="my-2 w-28 h-28 text-lg"
                    />

                    <p className='text-xs text-center text-muted-foreground mt-2'>
                      {result.protein < 10
                        ? 'Low'
                        : result.protein < 20
                        ? 'Moderate'
                        : 'High'}{' '}
                      protein content
                    </p>
                  </CardContent>
                </Card>

                {/* Fat Card */}
                <Card>
                  <CardContent className='p-4 flex flex-col items-center'>
                    <div className='flex items-center mb-2'>
                      <Croissant className='w-8 h-8 text-red-500 mr-3' />
                      <div>
                        <h3 className='text-sm font-medium text-muted-foreground'>
                          Fat
                        </h3>
                        <div className='flex items-baseline gap-1.5'>
                          <p className='text-2xl font-bold'>{result.fat}</p>
                          <span className='text-muted-foreground text-sm'>g</span>
                        </div>
                      </div>
                    </div>

                    <AnimatedCircularProgressBar
                      max={Math.max(25, result.fat * 1.5)} // Scale max to create context
                      value={result.fat}
                      min={0}
                      gaugePrimaryColor="hsl(0, 84%, 60%)" // Red for fat
                      gaugeSecondaryColor="hsl(0, 84%, 90%)"
                      className="my-2 w-28 h-28 text-lg"
                    />

                    <p className='text-xs text-center text-muted-foreground mt-2'>
                      {result.fat < 5
                        ? 'Low'
                        : result.fat < 15
                        ? 'Moderate'
                        : 'High'}{' '}
                      fat content
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quote Card */}
              <Card className='bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 shadow-sm border-none'>
                <CardContent className='p-6'>
                  <blockquote className='italic text-center relative px-6'>
                    <div className='absolute top-0 left-0 text-4xl text-primary/20'>
                      "
                    </div>
                    <p className='text-muted-foreground'>{randomQuote}</p>
                    <div className='absolute bottom-0 right-0 text-4xl text-primary/20'>
                      "
                    </div>
                  </blockquote>
                  <div className='flex justify-center mt-4'>
                    <Button variant='ghost' size='sm' onClick={nextQuote}>
                      Next Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info */}
              {result.additionalInfo && (
                <Card>
                  <CardContent className='p-6'>
                    <h3 className='text-lg font-semibold mb-3 flex items-center'>
                      <Utensils className='w-5 h-5 mr-2' />
                      Additional Information
                    </h3>
                    <div className='whitespace-pre-line text-muted-foreground'>
                      {result.additionalInfo}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value='macros' className='mt-0'>
              <Card>
                <CardContent className='p-6'>
                  <h3 className='text-lg font-semibold mb-4'>
                    Macronutrient Distribution
                  </h3>

                  {/* Macronutrient Donut Chart Visualization */}
                  <div className='flex justify-center mb-8'>
                    <div className='relative w-48 h-48'>
                      <svg viewBox='0 0 100 100' className='w-full h-full'>
                        {/* Background Circle */}
                        <circle
                          cx='50'
                          cy='50'
                          r='40'
                          fill='none'
                          stroke='#e9ecef'
                          strokeWidth='15'
                        />

                        {/* Calculate stroke-dasharray and stroke-dashoffset for each segment */}
                        {/* Carbs Segment */}
                        <motion.circle
                          cx='50'
                          cy='50'
                          r='40'
                          fill='none'
                          stroke='#FFC136'
                          strokeWidth='15'
                          strokeDasharray='251.2'
                          strokeDashoffset={251.2 - (251.2 * carbPercent) / 100}
                          transform='rotate(-90 50 50)'
                          initial={{ strokeDashoffset: 251.2 }}
                          animate={{
                            strokeDashoffset:
                              251.2 - (251.2 * carbPercent) / 100,
                          }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />

                        {/* Protein Segment */}
                        <motion.circle
                          cx='50'
                          cy='50'
                          r='40'
                          fill='none'
                          stroke='#3B82F6'
                          strokeWidth='15'
                          strokeDasharray='251.2'
                          strokeDashoffset={
                            251.2 - (251.2 * proteinPercent) / 100
                          }
                          transform={`rotate(${carbPercent * 3.6 - 90} 50 50)`}
                          initial={{ strokeDashoffset: 251.2 }}
                          animate={{
                            strokeDashoffset:
                              251.2 - (251.2 * proteinPercent) / 100,
                          }}
                          transition={{ duration: 1, delay: 0.4 }}
                        />

                        {/* Fat Segment */}
                        <motion.circle
                          cx='50'
                          cy='50'
                          r='40'
                          fill='none'
                          stroke='#EF4444'
                          strokeWidth='15'
                          strokeDasharray='251.2'
                          strokeDashoffset={251.2 - (251.2 * fatPercent) / 100}
                          transform={`rotate(${
                            (carbPercent + proteinPercent) * 3.6 - 90
                          } 50 50)`}
                          initial={{ strokeDashoffset: 251.2 }}
                          animate={{
                            strokeDashoffset:
                              251.2 - (251.2 * fatPercent) / 100,
                          }}
                          transition={{ duration: 1, delay: 0.6 }}
                        />
                      </svg>

                      {/* Center Text */}
                      <div className='absolute inset-0 flex flex-col items-center justify-center'>
                        <span className='text-2xl font-bold'>
                          {result.calories}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                          calories
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className='grid grid-cols-3 gap-4 text-center'>
                    <div>
                      <div className='flex items-center justify-center gap-2 mb-1'>
                        <div className='w-3 h-3 rounded-full bg-amber-400'></div>
                        <span className='font-medium'>Carbs</span>
                      </div>
                      <p className='text-2xl font-bold'>{carbPercent}%</p>
                      <p className='text-sm text-muted-foreground'>
                        {result.carbs}g
                      </p>
                    </div>
                    <div>
                      <div className='flex items-center justify-center gap-2 mb-1'>
                        <div className='w-3 h-3 rounded-full bg-blue-500'></div>
                        <span className='font-medium'>Protein</span>
                      </div>
                      <p className='text-2xl font-bold'>{proteinPercent}%</p>
                      <p className='text-sm text-muted-foreground'>
                        {result.protein}g
                      </p>
                    </div>
                    <div>
                      <div className='flex items-center justify-center gap-2 mb-1'>
                        <div className='w-3 h-3 rounded-full bg-red-500'></div>
                        <span className='font-medium'>Fat</span>
                      </div>
                      <p className='text-2xl font-bold'>{fatPercent}%</p>
                      <p className='text-sm text-muted-foreground'>
                        {result.fat}g
                      </p>
                    </div>
                  </div>

                  <Separator className='my-6' />

                  {/* Nutrition Quality Analysis */}
                  <div className="mt-6">
                    <h3 className='text-lg font-semibold mb-4'>Nutrition Quality Analysis</h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                      <div className="flex flex-col items-center">
                        <h4 className="text-sm font-medium mb-2">Protein Quality</h4>
                        <AnimatedCircularProgressBar
                          max={30}
                          value={result.protein}
                          min={0}
                          gaugePrimaryColor="hsl(217, 91%, 60%)"
                          gaugeSecondaryColor="hsl(217, 91%, 90%)"
                          className="w-24 h-24 text-sm"
                        />
                        <span className="text-sm mt-2 font-medium">
                          {result.protein < 10
                            ? 'Low'
                            : result.protein < 20
                            ? 'Moderate'
                            : 'High'}
                        </span>
                      </div>

                      <div className="flex flex-col items-center">
                        <h4 className="text-sm font-medium mb-2">Fiber Content</h4>
                        <AnimatedCircularProgressBar
                          max={8}
                          value={result.fiber}
                          min={0}
                          gaugePrimaryColor="hsl(142, 76%, 36%)"
                          gaugeSecondaryColor="hsl(142, 76%, 90%)"
                          className="w-24 h-24 text-sm"
                        />
                        <span className="text-sm mt-2 font-medium">
                          {result.fiber < 3
                            ? 'Low'
                            : result.fiber < 6
                            ? 'Moderate'
                            : 'High'}
                        </span>
                      </div>

                      <div className="flex flex-col items-center">
                        <h4 className="text-sm font-medium mb-2">Sugar Content</h4>
                        <AnimatedCircularProgressBar
                          max={25}
                          value={result.sugar}
                          min={0}
                          gaugePrimaryColor={
                            result.sugar > 15
                              ? "hsl(0, 84%, 60%)"
                              : result.sugar > 5
                              ? "hsl(38, 92%, 50%)"
                              : "hsl(142, 76%, 36%)"
                          }
                          gaugeSecondaryColor="hsl(217, 10%, 90%)"
                          className="w-24 h-24 text-sm"
                        />
                        <span className="text-sm mt-2 font-medium">
                          {result.sugar > 15
                            ? 'High'
                            : result.sugar > 5
                            ? 'Moderate'
                            : 'Low'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='details' className='mt-0 space-y-4'>
              {/* Additional Nutrients with Pagination */}
              <Card>
                <CardContent className='p-6'>
                  <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-lg font-semibold'>
                      Additional Nutrients
                    </h3>

                    {totalPages > 1 && (
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            setCurrentPage((p) => Math.max(0, p - 1))
                          }
                          disabled={currentPage === 0}
                        >
                          <ChevronLeft className='h-4 w-4' />
                        </Button>
                        <span className='text-sm'>
                          {currentPage + 1} / {totalPages}
                        </span>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            setCurrentPage((p) =>
                              Math.min(totalPages - 1, p + 1)
                            )
                          }
                          disabled={currentPage === totalPages - 1}
                        >
                          <ChevronRight className='h-4 w-4' />
                        </Button>
                      </div>
                    )}
                  </div>

                  {additionalNutrients.length > 0 ? (
                    <div className='space-y-3'>
                      {currentNutrients.map((nutrient, index) => (
                        <div
                          key={index}
                          className='grid grid-cols-5 items-center py-2 border-b last:border-0'
                        >
                          <div className='col-span-2 font-medium'>
                            {nutrient.name}
                          </div>
                          <div className='col-span-2'>
                            {typeof nutrient.value === 'object' ? (
                              <span>
                                {nutrient.value.amount || 0}
                                {nutrient.value.unit || ''}
                                {nutrient.value.daily_value_percentage
                                  ? ` (${nutrient.value.daily_value_percentage}% DV)`
                                  : ''}
                              </span>
                            ) : (
                              <span>{nutrient.value || 'N/A'}</span>
                            )}
                          </div>
                          <div className='col-span-1 text-right text-xs text-muted-foreground'>
                            {nutrient.value?.category && (
                              <Badge variant='outline' className='ml-2'>
                                {nutrient.value.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-muted-foreground text-center py-6'>
                      No additional nutrients information available
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Ingredients List */}
              {result.rawData?.ingredients && (
                <Card>
                  <CardContent className='p-6'>
                    <h3 className='text-lg font-semibold mb-3'>Ingredients</h3>
                    {Array.isArray(result.rawData.ingredients) ? (
                      <ul className='list-disc pl-5 space-y-1'>
                        {result.rawData.ingredients.map((ingredient, index) => (
                          <li key={index} className='text-muted-foreground'>
                            {ingredient}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className='text-muted-foreground'>
                        Ingredients information not available
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Allergens List */}
              {result.rawData?.allergens && (
                <Card>
                  <CardContent className='p-6'>
                    <h3 className='text-lg font-semibold mb-3'>Allergens</h3>
                    {Array.isArray(result.rawData.allergens) &&
                    result.rawData.allergens.length > 0 ? (
                      <div className='flex flex-wrap gap-2'>
                        {result.rawData.allergens.map((allergen, index) => (
                          <Badge key={index} variant='destructive'>
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className='text-muted-foreground'>
                        No allergens listed
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Product Details */}
              {result.rawData?.product_details && (
                <Card>
                  <CardContent className='p-6'>
                    <h3 className='text-lg font-semibold mb-3'>
                      Product Details
                    </h3>
                    <div className='grid grid-cols-2 gap-4'>
                      {Object.entries(result.rawData.product_details).map(
                        ([key, value]) => (
                          <div key={key} className='flex flex-col'>
                            <span className='text-sm text-muted-foreground'>
                              {formatNutrientName(key)}
                            </span>
                            <span className='font-medium'>
                              {typeof value === 'object'
                                ? JSON.stringify(value)
                                : value?.toString() || 'N/A'}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {result.rawData && (
              <TabsContent value='raw' className='mt-0'>
                <Card>
                  <CardContent className='p-6'>
                    <div className='flex justify-between items-center mb-4'>
                      <h3 className='text-lg font-semibold'>
                        Raw Analysis Data
                      </h3>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={handleCopyToClipboard}
                        className='flex items-center gap-1.5'
                      >
                        {copied ? (
                          <>
                            <Check className='h-4 w-4' />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className='h-4 w-4' />
                            <span>Copy JSON</span>
                          </>
                        )}
                      </Button>
                    </div>
                    <div className='bg-muted rounded-md p-4 overflow-x-auto max-h-[400px]'>
                      <pre className='text-xs'>
                        {JSON.stringify(result.rawData, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </CredenzaBody>
        </Tabs>

        <CredenzaFooter className='px-6 py-4 bg-muted/50'>
          <div className='flex items-center justify-between w-full'>
            <p className='text-sm text-muted-foreground'>
              Analyzed on {new Date().toLocaleDateString()}
            </p>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={handleCopyToClipboard}
              >
                {copied ? (
                  <Check className='h-4 w-4 mr-1.5' />
                ) : (
                  <Copy className='h-4 w-4 mr-1.5' />
                )}
                {copied ? 'Copied!' : 'Copy Data'}
              </Button>
              <Button variant='default' size='sm'>
                <Share2 className='h-4 w-4 mr-1.5' />
                Share Results
              </Button>
            </div>
          </div>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}