import { Outlet } from 'react-router'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

const ProtectedLayout = () => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar variant="inset" collapsible="icon" />
        <SidebarInset className="pl-0">
          <div className='flex h-screen w-full bg-background rounded-2xl overflow-hidden overflow-y-auto'>
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}

export default ProtectedLayout
