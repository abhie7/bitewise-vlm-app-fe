import { Moon, MoreHorizontal, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { useSidebar } from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function ModeToggle() {
  const { setTheme } = useTheme()
  const { open } = useSidebar()

  return (
    <TooltipProvider delayDuration={0}>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger className='cursor-pointer flex w-full items-center gap-2 px-2 py-2.5 text-sm font-normal rounded-md hover:bg-accent hover:text-accent-foreground'>
              <div className='relative h-4 w-4'>
                <Sun className='absolute h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
              </div>
              {open && <span className='flex-1 text-left'>Theme</span>}
              <MoreHorizontal className='hidden h-4 w-4 text-muted-foreground lg:block' />
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side='right' className='w-24 text-center'>
            Change Theme
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={() => setTheme('light')}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}
