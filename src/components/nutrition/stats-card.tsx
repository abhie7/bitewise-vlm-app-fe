import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface StatsCardProps {
  title: string
  value: string | number
  unit?: string
  loading?: boolean
}

export const StatsCard = ({ title, value, unit, loading }: StatsCardProps) => {
  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className='h-7 w-[60%]' />
        ) : (
          <div className='text-2xl font-bold'>
            {value}
            {unit && (
              <span className='text-sm text-muted-foreground ml-1'>{unit}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
