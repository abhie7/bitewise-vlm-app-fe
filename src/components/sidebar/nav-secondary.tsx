import * as React from 'react'
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'

interface NavSecondaryProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    title: string
    url?: string
    icon: React.ElementType
    component?: React.ComponentType
  }[]
}

export function NavSecondary({ items, className, ...props }: NavSecondaryProps) {
  return (
    <div className={className} {...props}>
      <SidebarMenu>
        {items.map((item, index) => (
          <SidebarMenuItem key={index}>
            {item.component ? (
              <div className="flex items-center gap-2 px-2 py-1">
                <item.component />
              </div>
            ) : (
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon className="h-4 w-4" />
                </a>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  )
}
