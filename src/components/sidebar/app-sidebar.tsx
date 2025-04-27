import * as React from 'react'
import {
  Moon,
  LayoutDashboard,
  ChartLine,
  CalendarHeart,
  HeartHandshake,
} from 'lucide-react'

import { NavMain } from '@/components/sidebar/nav-main'
import { NavProjects } from '@/components/sidebar/nav-projects'
import { NavSecondary } from '@/components/sidebar/nav-secondary'
import { NavUser } from '@/components/sidebar/nav-user'
import { ModeToggle } from '@/components/mode-toggle'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import MeetOllieDialog from './meet-ollie-dialog'
const data = {
  user: {
    name: 'Bitewise Inc.',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Analytics',
      url: '/analytics',
      icon: ChartLine,
    },
    {
      title: 'Calendar',
      url: '/calendar',
      icon: CalendarHeart,
    },
  ],
  navSecondary: [
    {
      title: 'Meet Ollie!',
      icon: HeartHandshake,
      component: MeetOllieDialog,
    },
    {
      title: 'Theme',
      icon: Moon,
      component: ModeToggle,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <a href='#'>
                <div className='flex aspect-square size-7 items-center justify-center rounded-lg'>
                  <img src='/favBlur.svg' alt='Logo' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>Bitewise Inc.</span>
                  <span className='truncate text-xs'>Track your journey</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
