// app/analytics/page.tsx
import { Header } from '@/components/header/header'
import { MacronutrientRadarChart } from '@/components/nutrition/macronutrient-radar-chart'
import { SugarFiberBalance } from '@/components/nutrition/sugar-fiber-balance'
import { MicronutrientChart } from '@/components/nutrition/micronutrient-chart'
import { useSelector } from 'react-redux'
import { Card, CardContent } from '@/components/ui/card'
import { NutrientQualityGauge } from '@/components/nutrition/nutrient-quality-gauge'
import { DailyCalorieTrend } from '@/components/nutrition/daily-calorie-trend'

export default function AnalyticsPage() {
  const items = useSelector((state: any) => state.nutrition.items)

  return (
    <div className='flex flex-col min-h-screen w-full pl-0'>
      <Header
        title='Analytics Dashboard'
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Analytics', path: '/analytics', isCurrent: true },
        ]}
      />

      <main className='flex flex-1 flex-col gap-6 p-4 pb-16'>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Card className="p-4">
              <CardContent className="p-2">
                <h3 className="font-semibold mb-4">Nutrient Quality Score</h3>
                <NutrientQualityGauge items={items} />
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardContent className="p-2">
                <h3 className="font-semibold mb-4">Sugar to Fiber Balance</h3>
                <SugarFiberBalance items={items} />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <Card className="p-4">
              <CardContent className="p-2">
                <h3 className="font-semibold mb-4">Macronutrient Radar</h3>
                <MacronutrientRadarChart items={items} />
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardContent className="p-2">
                <h3 className="font-semibold mb-4">Micronutrient Analysis</h3>
                <MicronutrientChart items={items} />
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="p-4">
          <CardContent className="p-2">
            <h3 className="font-semibold mb-4">Daily Calorie Trend</h3>
            <div className="h-80">
              <DailyCalorieTrend items={items} />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}