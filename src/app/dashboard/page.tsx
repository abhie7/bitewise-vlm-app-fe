import { Header } from '@/components/layout/header'

export default function Dashboard() {
  return (
    <div className='flex flex-col min-h-screen w-full pl-0'>
      <Header
        title='Dashboard'
        breadcrumbs={[{ label: 'Home', path: '/dashboard', isCurrent: true }]}
      />
      <main className='flex flex-1 flex-col gap-4 p-4'>
        <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
          <div className='aspect-video rounded-xl bg-muted/50' />
          <div className='aspect-video rounded-xl bg-muted/50' />
          <div className='aspect-video rounded-xl bg-muted/50' />
        </div>
        <div className='min-h-[50vh] flex-1 rounded-xl bg-muted/50 md:min-h-min' />
      </main>
    </div>
  )
}
