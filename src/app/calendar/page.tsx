import { Header } from '@/components/header/header'
import { FullCalendar, CalendarPrevTrigger, CalendarNextTrigger, CalendarTodayTrigger, CalendarCurrentDate, CalendarViewTrigger, CalendarDayView, CalendarWeekView, CalendarMonthView, CalendarYearView } from '@/components/ui/full-calendar'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState, NutritionItem } from '@/types'
import { format, addHours } from 'date-fns'

const Calendar = () => {
  const nutritionItems = useSelector((state: RootState) => state.nutrition.items)

  // Convert UTC to IST (UTC+5:30)
  const convertToIST = (date: Date) => {
    return addHours(date, 5.5)
  }

  // Generate calendar events from nutrition data
  const generateEvents = () => {
    const events = []

    // Group items by date
    const itemsByDate = nutritionItems.reduce((acc, item) => {
      const date = new Date(item.createdAt)
      const dateKey = date.toISOString().split('T')[0]
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(item)
      return acc
    }, {} as Record<string, NutritionItem[]>)

    // Create events for each date
    Object.entries(itemsByDate).forEach(([dateKey, items]) => {
      // Calculate daily totals
      const dailyTotal = items.reduce((acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fat: acc.fat + item.fat
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

      // Add daily summary event
      events.push({
        id: `daily-${dateKey}`,
        start: convertToIST(new Date(`${dateKey}T00:00:00Z`)),
        end: convertToIST(new Date(`${dateKey}T23:59:59Z`)),
        title: `Daily Summary: ${dailyTotal.calories} kcal`,
        color: 'blue'
      })

      // Add individual meal events
      items.forEach((item) => {
        const mealTime = convertToIST(new Date(item.createdAt))
        events.push({
          id: `meal-${item._id}`,
          start: mealTime,
          end: addHours(mealTime, 1),
          title: `${item.foodName} (${item.calories} kcal)`,
          color: getMealColor(item)
        })
      })
    })

    return events
  }

  // Helper function to determine meal color based on nutrition quality
  const getMealColor = (item: NutritionItem) => {
    const proteinScore = item.protein > 20 ? 1 : item.protein > 15 ? 0.5 : 0
    const fiberScore = item.fiber > 5 ? 1 : item.fiber > 3 ? 0.5 : 0
    const sugarScore = item.sugar < 10 ? 1 : item.sugar < 15 ? 0.5 : 0

    const totalScore = proteinScore + fiberScore + sugarScore
    if (totalScore >= 2.5) return 'green'
    if (totalScore >= 1.5) return 'blue'
    if (totalScore >= 0.5) return 'purple'
    return 'pink'
  }

  return (
    <div className='flex flex-col min-h-screen w-full pl-0'>
      <Header
        title='Calendar'
        breadcrumbs={[
          { label: 'Home', path: '/dashboard', isCurrent: false },
          { label: 'Calendar', path: '/calendar', isCurrent: true },
        ]}
      />
      <main className='flex flex-1 flex-col gap-4 p-4'>
        <FullCalendar
          events={generateEvents()}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarPrevTrigger>
                <ChevronLeft className="h-4 w-4" />
              </CalendarPrevTrigger>
              <CalendarNextTrigger>
                <ChevronRight className="h-4 w-4" />
              </CalendarNextTrigger>
              <CalendarTodayTrigger>Today</CalendarTodayTrigger>
              <CalendarCurrentDate />
            </div>
            <div className="flex items-center gap-2">
              <CalendarViewTrigger view="day">Day</CalendarViewTrigger>
              <CalendarViewTrigger view="week">Week</CalendarViewTrigger>
              <CalendarViewTrigger view="month">Month</CalendarViewTrigger>
              <CalendarViewTrigger view="year">Year</CalendarViewTrigger>
            </div>
          </div>
          <CalendarDayView />
          <CalendarWeekView />
          <CalendarMonthView />
          <CalendarYearView />
        </FullCalendar>
      </main>
    </div>
  )
}

export default Calendar
