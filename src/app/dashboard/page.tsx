import { PageTitle } from '../../components/ui/page-title'
import { Header } from '../../components/header/header'

export default function DashboardPage() {
  return (
    <>
      <PageTitle title='Dashboard' />
      <Header title='Dashboard' />
      <main className='flex flex-1 flex-col gap-4 p-4'>
        <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
          <div className='aspect-video rounded-xl bg-muted/50' />
          <div className='aspect-video rounded-xl bg-muted/50' />
          <div className='aspect-video rounded-xl bg-muted/50' />
        </div>
        <div className='min-h-[50vh] flex-1 rounded-xl bg-muted/50 md:min-h-min' />
      </main>
    </>
  )
}
