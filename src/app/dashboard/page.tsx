// app/dashboard/page.tsx
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
import { useState } from 'react'

export default function DashboardPage() {
  const { items, loading } = useSelector((state: any) => state.nutrition)
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="app-container flex flex-col min-h-screen w-full">
      <PageTitle title='Dashboard' />
      <Header title='Dashboard' />
      <div className="app-content">
        <main className='app-main p-4 pb-16'>
          <StatsGrid items={items} loading={loading} />

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="pt-4">
              <div className='grid gap-4 md:grid-cols-2'>
                <DailyCalorieTrend items={items} />
                <MacroMicroChart items={items} />
              </div>

              <div className='grid gap-4 md:grid-cols-2 mt-4'>
                <MacronutrientRadarChart items={items} />
                <NutrientQualityGauge items={items} />
              </div>
            </TabsContent>

            <TabsContent value="nutrition" className="pt-4">
              <div className='grid gap-4 md:grid-cols-2'>
                <SugarFiberBalance items={items} />
                <MicronutrientChart items={items} />
              </div>

              {/* Additional nutrition charts could go here */}
              <div className='grid gap-4 mt-4'>
                <Card className="h-72">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Nutrient Balance</h3>
                    {items.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        No data available
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        Add more foods to see detailed nutrient balance analysis
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="ingredients" className="pt-4">
              <div className='grid gap-4 md:grid-cols-1'>
                <IngredientWordCloud items={items} />
              </div>

              {/* Additional ingredient analysis could go here */}
              <div className='grid gap-4 md:grid-cols-2 mt-4'>
                <Card className="h-72">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Common Ingredients</h3>
                    {items.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        No data available
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        Add more foods with ingredients to see analysis
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="h-72">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Allergen Alert</h3>
                    {items.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        No data available
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        No allergens detected in your analyzed foods
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
