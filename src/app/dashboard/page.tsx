import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen w-full pl-0">
      <header className='w-full flex h-16 shrink-0 items-center'>
        <div className='flex items-center gap-2 px-4'>
          <SidebarTrigger className='cursor-pointer'/>
          <Separator orientation='vertical' className='mr-2 h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink href='#'>
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='hidden md:block' />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
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
