'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  User,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/types'
import { logoutUser } from '@/services/authService'
import DynamicAvatar from '@/components/ui/dynamic-avatar'
import { useAppDispatch } from '@/services/store'
import { SidebarMenuButton } from '../ui/sidebar'

export function NavUser() {
  const dispatch = useAppDispatch()
  const { user } = useSelector((state: RootState) => state.auth)

  if (!user) return null

  const userData = {
    name: user.data.userName || 'User',
    email: user.data.email,
    avatar: user.data.avatar || null,
  }

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  // Check if we have valid avatar data
  const hasAvatarData = userData.avatar && userData.avatar.avatarData

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer transition-all'
        >
          <div className='relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full'>
            {hasAvatarData ? (
              <DynamicAvatar
                avatarData={userData.avatar.avatarData}
                size={32}
                className='rounded-full'
              />
            ) : (
              <Avatar>
                <AvatarImage src='/favicon.svg' alt={userData.name} />
                <AvatarFallback>
                  <User className='h-4 w-4' />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className='grid flex-1 text-left leading-none'>
            <span className='truncate font-medium'>{userData.name}</span>
            <span className='truncate text-xs text-muted-foreground'>
              {userData.email}
            </span>
          </div>
          <ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='p-0 font-normal'>
          <div className='flex flex-col items-center gap-2 p-4 text-center'>
            <div className='relative h-16 w-16 overflow-hidden rounded-full'>
              {hasAvatarData ? (
                <DynamicAvatar
                  avatarData={userData.avatar.avatarData}
                  size={64}
                />
              ) : (
                <Avatar className='h-full w-full'>
                  <AvatarImage src='/favicon.svg' alt={userData.name} />
                  <AvatarFallback>
                    {userData.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-medium leading-none'>
                {userData.name}
              </p>
              <p className='text-xs leading-none text-muted-foreground'>
                {userData.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck className='mr-2 h-4 w-4' />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className='mr-2 h-4 w-4' />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell className='mr-2 h-4 w-4' />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer' onClick={handleLogout}>
          <LogOut className='mr-2 h-4 w-4' />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
