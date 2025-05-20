// app/dashboard/page.tsx
"use client"

import { PageTitle } from '@/components/ui/page-title'
import { Header } from '@/components/header/header'
import { StatsGrid } from '@/components/nutrition/stats-grid'
import { MacroMicroChart } from '@/components/nutrition/macro-micro-chart'
import { DailyCalorieTrend } from '@/components/nutrition/daily-calorie-trend'
import { MacronutrientRadarChart } from '@/components/nutrition/macronutrient-radar-chart'
import { IngredientWordCloud } from '@/components/nutrition/ingredient-word-cloud'
import { SugarFiberBalance } from '@/components/nutrition/sugar-fiber-balance'
import { MicronutrientChart } from '@/components/nutrition/micronutrient-chart'
import { NutrientQualityGauge } from '@/components/nutrition/nutrient-quality-gauge'
import { useSelector } from 'react-redux'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

const DashboardPage = () => {
  const { items, loading } = useSelector((state: any) => state.nutrition)
  const [activeTab, setActiveTab] = useState('overview')
  const [mounted, setMounted] = useState(false)

  // Handle SSR
  useEffect(() => {
    setMounted(true)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren"
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="app-container flex flex-col min-h-screen w-full">
      <PageTitle title='Nutrition Dashboard' />
      <Header title='Dashboard' />
      <div className="app-content">
        <main className='app-main p-4 pb-16 max-w-full mx-auto'>
          <StatsGrid items={items} loading={loading} />

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
              <TabsList className="grid grid-cols-3 w-auto">
                <TabsTrigger value="overview" className="px-4">Overview</TabsTrigger>
                <TabsTrigger value="nutrition" className="px-4">Nutrition</TabsTrigger>
                <TabsTrigger value="insights" className="px-4">Insights</TabsTrigger>
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <TabsContent value="overview" className="pt-4" asChild>
                  <motion.div
                    key="overview"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="grid gap-6 md:grid-cols-12"
                  >
                    <motion.div variants={itemVariants} className="md:col-span-8">
                      {loading ? (
                        <ChartSkeleton height="md" />
                      ) : (
                        <DailyCalorieTrend items={items} />
                      )}
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:col-span-4">
                      {loading ? (
                        <ChartSkeleton height="md" />
                      ) : (
                        <MacroMicroChart items={items} />
                      )}
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:col-span-6">
                      {loading ? (
                        <ChartSkeleton />
                      ) : (
                        <NutrientQualityGauge items={items} />
                      )}
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:col-span-6">
                      {loading ? (
                        <ChartSkeleton />
                      ) : (
                        <MacronutrientRadarChart items={items} />
                      )}
                    </motion.div>
                  </motion.div>
                </TabsContent>
              )}

              {activeTab === "nutrition" && (
                <TabsContent value="nutrition" className="pt-4" asChild>
                  <motion.div
                    key="nutrition"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="grid gap-6 md:grid-cols-12"
                  >
                    <motion.div variants={itemVariants} className="md:col-span-8">
                      {loading ? (
                        <ChartSkeleton height="md" />
                      ) : (
                        <MicronutrientChart items={items} />
                      )}
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:col-span-4">
                      <Card className="h-full overflow-hidden">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            Daily Values
                            <Badge variant="outline" className="ml-2 text-xs font-normal">% of RDI</Badge>
                          </h3>

                          {loading ? (
                            <div className="space-y-4">
                              {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="flex items-center justify-between">
                                  <Skeleton className="h-4 w-24" />
                                  <Skeleton className="w-32 h-2 rounded-full" />
                                  <Skeleton className="h-4 w-8" />
                                </div>
                              ))}
                            </div>
                          ) : items?.length === 0 ? (
                            <EmptyState message="No nutrition data available" />
                          ) : (
                            <motion.div
                              className="space-y-4"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              {Object.entries(items[0]?.rawAnalysisData?.nutrients || {})
                                .filter(([_, nutrient]: [string, any]) => nutrient?.daily_value_percentage !== null)
                                .map(([key, nutrient]: [string, any], index) => (
                                  <motion.div
                                    key={key}
                                    className="flex items-center justify-between"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                  >
                                    <span className="text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <motion.div
                                        className="h-full bg-orange-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(nutrient.daily_value_percentage, 100)}%` }}
                                        transition={{ duration: 0.8, delay: 0.2 + index * 0.05, ease: "easeOut" }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium">{nutrient.daily_value_percentage}%</span>
                                  </motion.div>
                                ))}
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:col-span-12">
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-lg mb-4">Nutrient Balance</h3>

                          {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="p-4 rounded-lg bg-gray-50">
                                  <Skeleton className="h-4 w-24 mx-auto mb-2" />
                                  <Skeleton className="h-8 w-16 mx-auto mb-1" />
                                  <Skeleton className="h-3 w-12 mx-auto" />
                                </div>
                              ))}
                            </div>
                          ) : items?.length === 0 ? (
                            <EmptyState message="No nutrient data available" />
                          ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {Object.entries(items[0]?.rawAnalysisData?.nutrients || {})
                                .filter(([_, nutrient]: [string, any]) => nutrient?.category === 'macronutrient')
                                .map(([key, nutrient]: [string, any], index) => (
                                  <motion.div
                                    key={key}
                                    className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    whileHover={{ y: -4 }}
                                  >
                                    <h4 className="text-sm font-medium capitalize mb-2">{key.replace(/_/g, ' ')}</h4>
                                    <p className="text-2xl font-bold text-orange-500">{nutrient.amount}{nutrient.unit}</p>
                                    {nutrient.daily_value_percentage && (
                                      <p className="text-sm text-muted-foreground">{nutrient.daily_value_percentage}% DV</p>
                                    )}
                                  </motion.div>
                                ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </TabsContent>
              )}

              {activeTab === "insights" && (
                <TabsContent value="insights" className="pt-4" asChild>
                  <motion.div
                    key="insights"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="grid gap-6 md:grid-cols-12"
                  >
                    <motion.div variants={itemVariants} className="md:col-span-6">
                      <Card className="h-full">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-lg mb-4 flex items-center">
                            Health Insights
                            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200">
                              AI Analysis
                            </Badge>
                          </h3>

                          {loading ? (
                            <div className="space-y-4">
                              {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-24 w-full rounded-lg" />
                              ))}
                            </div>
                          ) : items?.length === 0 ? (
                            <EmptyState message="No health insights available" />
                          ) : (
                            <motion.div
                              className="space-y-4"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              {items[0]?.rawAnalysisData?.allergens?.length > 0 && (
                                <motion.div
                                  className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-100"
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: 0.3 }}
                                >
                                  <h4 className="font-medium mb-2 flex items-center">
                                    <AlertIcon className="mr-2 h-4 w-4" />
                                    Allergen Alert
                                  </h4>
                                  <p>This food contains: {items[0].rawAnalysisData.allergens?.join(', ')}</p>
                                </motion.div>
                              )}

                              {items[0]?.rawAnalysisData?.nutrients?.total_fat?.sub_nutrients?.saturated_fat?.amount > 5 && (
                                <motion.div
                                  className="p-4 rounded-lg bg-amber-50 text-amber-700 border border-amber-100"
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: 0.4 }}
                                >
                                  <h4 className="font-medium mb-2 flex items-center">
                                    <WarningIcon className="mr-2 h-4 w-4" />
                                    High Saturated Fat
                                  </h4>
                                  <p>This food contains a high amount of saturated fat which may increase risk of heart disease when consumed in excess.</p>
                                </motion.div>
                              )}

                              {items[0]?.rawAnalysisData?.nutrients?.carbohydrates?.sub_nutrients?.added_sugar?.amount > 10 && (
                                <motion.div
                                  className="p-4 rounded-lg bg-amber-50 text-amber-700 border border-amber-100"
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: 0.5 }}
                                >
                                  <h4 className="font-medium mb-2 flex items-center">
                                    <WarningIcon className="mr-2 h-4 w-4" />
                                    High Added Sugar
                                  </h4>
                                  <p>This food contains a high amount of added sugar, which should be limited to less than 10% of daily calories.</p>
                                </motion.div>
                              )}

                              {/* Positive insight */}
                              <motion.div
                                className="p-4 rounded-lg bg-green-50 text-green-700 border border-green-100"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                              >
                                <h4 className="font-medium mb-2 flex items-center">
                                  <CheckIcon className="mr-2 h-4 w-4" />
                                  Good Protein Source
                                </h4>
                                <p>This meal provides a good amount of protein which helps with muscle maintenance and satiety.</p>
                              </motion.div>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:col-span-6">
                      <Card className="h-full">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-lg mb-4">Nutrition Score</h3>

                          {loading ? (
                            <div className="space-y-6">
                              <div className="flex items-center justify-between mb-6">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="w-32 h-2 rounded-full" />
                                <Skeleton className="h-4 w-8" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <Skeleton className="h-32 rounded-lg" />
                                <Skeleton className="h-32 rounded-lg" />
                              </div>
                            </div>
                          ) : items?.length === 0 ? (
                            <EmptyState message="No nutrition score available" />
                          ) : (
                            <motion.div
                              className="space-y-6"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <div className="flex items-center justify-between mb-6">
                                <span className="text-sm font-medium">Overall Score</span>
                                <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-green-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: '75%' }}
                                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                                  />
                                </div>
                                <span className="text-sm font-bold">75/100</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <motion.div
                                  className="p-6 rounded-lg bg-green-50 border border-green-100 relative overflow-hidden"
                                  initial={{ y: 20, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ delay: 0.4 }}
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-full -mt-8 -mr-8 opacity-50" />
                                  <h4 className="text-sm font-medium mb-2 text-green-800">Protein Quality</h4>
                                  <p className="text-2xl font-bold text-green-600">Good</p>
                                  <p className="mt-2 text-xs text-green-700">Complete protein profile with essential amino acids</p>
                                </motion.div>

                                <motion.div
                                  className="p-6 rounded-lg bg-amber-50 border border-amber-100 relative overflow-hidden"
                                  initial={{ y: 20, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ delay: 0.5 }}
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100 rounded-full -mt-8 -mr-8 opacity-50" />
                                  <h4 className="text-sm font-medium mb-2 text-amber-800">Sugar Content</h4>
                                  <p className="text-2xl font-bold text-amber-600">Moderate</p>
                                  <p className="mt-2 text-xs text-amber-700">12g per serving (24% of recommended limit)</p>
                                </motion.div>

                                <motion.div
                                  className="p-6 rounded-lg bg-blue-50 border border-blue-100 relative overflow-hidden sm:col-span-2"
                                  initial={{ y: 20, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ delay: 0.6 }}
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-full -mt-8 -mr-8 opacity-50" />
                                  <h4 className="text-sm font-medium mb-2 text-blue-800">Recommendation</h4>
                                  <p className="text-lg font-medium text-blue-600">Good choice for post-workout recovery</p>
                                  <p className="mt-2 text-xs text-blue-700">Good balance of protein and carbs for muscle recovery</p>
                                </motion.div>
                              </div>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </TabsContent>
              )}
            </AnimatePresence>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

// Helper Components
const ChartSkeleton = ({ height = "sm" }: { height?: "sm" | "md" | "lg" }) => {
  const heightClass = {
    sm: "h-64",
    md: "h-80",
    lg: "h-96"
  }[height]

  return (
    <Card>
      <CardContent className={`p-6 ${heightClass}`}>
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
        <div className="flex items-center justify-center h-4/5 w-full">
          <div className="w-full h-full flex flex-col justify-center items-center">
            <Skeleton className={`w-full rounded-md ${heightClass} max-h-64`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const EmptyState = ({ message }: { message: string }) => (
  <motion.div
    className="h-48 flex flex-col items-center justify-center text-muted-foreground"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
  >
    <div className="bg-gray-100 rounded-full p-3 mb-3">
      <ChartIcon className="w-6 h-6 text-gray-400" />
    </div>
    <p>{message}</p>
    <p className="text-sm mt-2">Try adding some foods to see analytics</p>
  </motion.div>
)

// Icons
const AlertIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
)

const WarningIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const ChartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
)

export default DashboardPage