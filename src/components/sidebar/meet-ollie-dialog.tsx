import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'
import { HeartHandshake, MoreHorizontal } from 'lucide-react'
import { SidebarMenuButton, useSidebar } from '../ui/sidebar'
import { useState } from 'react'
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
} from '../ui/credenza'
import MeetOllieCarousel from './meet-ollie-carousal'

const MeetOllieDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { open } = useSidebar()

  return (
    <>
      <Credenza open={dialogOpen} onOpenChange={setDialogOpen}>
        <CredenzaContent className='p-4 sm:max-w-[600px]'>
          <CredenzaHeader>
            <CredenzaTitle>Meet Ollie</CredenzaTitle>
            <CredenzaDescription>
              Learn about Ollie, your nutrition analysis assistant
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody className='flex flex-col items-center justify-center'>
            <div className='w-full h-[350px] md:h-[450px] overflow-hidden rounded-lg'>
              <MeetOllieCarousel />
            </div>
          </CredenzaBody>
        </CredenzaContent>
      </Credenza>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton
              onClick={() => setDialogOpen(true)}
              className={`cursor-pointer flex w-full items-center ${
                open ? 'gap-2 px-2 py-2.5' : 'justify-center px-0 py-2.5'
              } text-sm font-normal rounded-md hover:bg-accent hover:text-accent-foreground`}
            >
              <div className='relative h-4 w-4 flex items-center justify-center'>
                <HeartHandshake className='h-4 w-4' />
              </div>
              {open && <span className='flex-1 text-left'>Meet Ollie!</span>}
              {open && (
                <MoreHorizontal className='hidden h-4 w-4 text-muted-foreground lg:block' />
              )}
            </SidebarMenuButton>
          </TooltipTrigger>
          <TooltipContent side='right' className='w-24 text-center'>
            Ollie's Backstory
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}

export default MeetOllieDialog
