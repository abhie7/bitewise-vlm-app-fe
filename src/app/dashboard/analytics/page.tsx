import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { Header } from '@/components/layout/header'

export default function AnalyticsPage() {
  // Custom actions to demonstrate the header's flexibility
  const headerActions = (
    <Button size="sm" variant="outline">
      <Download className="mr-2 h-4 w-4" />
      Export
    </Button>
  )

  return (
    <div className="flex flex-col min-h-screen w-full pl-0">
      {/* You can override the header locally if needed */}
      <Header
        title="Analytics Dashboard"
        actions={headerActions}
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Analytics', path: '/analytics', isCurrent: true }
        ]}
      />

      <main className='flex flex-1 flex-col gap-4 p-4'>
        <div className='grid gap-4 md:grid-cols-2'>
          <div className='h-64 rounded-xl bg-muted/50 p-4'>
            <h3 className="text-lg font-semibold">Performance Metrics</h3>
          </div>
          <div className='h-64 rounded-xl bg-muted/50 p-4'>
            <h3 className="text-lg font-semibold">User Activity</h3>
          </div>
        </div>
        <div className='grid gap-4 md:grid-cols-3'>
          <div className='h-48 rounded-xl bg-muted/50 p-4'>
            <h3 className="text-lg font-semibold">Daily Stats</h3>
          </div>
          <div className='h-48 rounded-xl bg-muted/50 p-4'>
            <h3 className="text-lg font-semibold">Weekly Stats</h3>
          </div>
          <div className='h-48 rounded-xl bg-muted/50 p-4'>
            <h3 className="text-lg font-semibold">Monthly Stats</h3>
          </div>
        </div>
      </main>
    </div>
  )
}
