import * as React from 'react'
import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Moon,
  Sparkles,
  WandSparkles,
  Loader2,
  Ban,
} from 'lucide-react'
import { motion } from 'framer-motion'

import { NavMain } from '@/components/sidebar/nav-main'
import { NavProjects } from '@/components/sidebar/nav-projects'
import { NavSecondary } from '@/components/sidebar/nav-secondary'
import { NavUser } from '@/components/sidebar/nav-user'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { ImageUploader } from '@/components/sidebar/image-uploader'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/ui/credenza'

const data = {
  user: {
    name: 'Bitewise Inc.',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Theme',
      icon: Moon,
      component: ModeToggle,
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
}

function UploadImageModal() {
  const [open, setOpen] = React.useState(false)
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleSubmit = async () => {
    if (!selectedImage) return

    setIsSubmitting(true)
    try {
      console.log('Uploading image:', selectedImage.name)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setOpen(false)
      setSelectedImage(null)
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
  }

  return (
    <div className='px-3 py-2'>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>
        <Button
          onClick={handleOpen}
          variant='default'
          className='w-full flex items-center gap-2 cursor-pointer'
        >
          <Sparkles size={16} />
          <span>Upload Image</span>
        </Button>
      </motion.div>

      <Credenza open={open} onOpenChange={setOpen}>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Upload Image</CredenzaTitle>
            <CredenzaDescription>
              Upload an image to analyze nutrition information
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            <ImageUploader
              onImageSelected={setSelectedImage}
              onReset={handleReset}
            />
          </CredenzaBody>
          <CredenzaFooter className='flex justify-between'>
            <CredenzaClose asChild>
              <Button variant='outline'>
                <Ban size={12} />
                Cancel
              </Button>
            </CredenzaClose>
            <Button
              variant='default'
              onClick={handleSubmit}
              disabled={!selectedImage || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='animate-spin' size={12} />
                  'Processing...'
                </>
              ) : (
                <>
                  <WandSparkles size={12} />
                  Analyze Image
                </>
              )}
            </Button>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </div>
  )
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
        <UploadImageModal />
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
