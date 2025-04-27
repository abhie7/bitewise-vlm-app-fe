import React from 'react'
import { Bell, Sparkles, WandSparkles, Loader2, Ban } from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

import { motion } from 'framer-motion'
import { ImageUploader } from '@/components/sidebar/image-uploader'
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/ui/credenza'
import FileUpload from '../ui/file-upload'

export type BreadcrumbItem = {
  label: string
  path: string
  isCurrent?: boolean
}

interface HeaderProps {
  breadcrumbs?: BreadcrumbItem[]
  title?: string
  actions?: React.ReactNode
}

export function Header({
  breadcrumbs: customBreadcrumbs,
  title,
  actions,
}: HeaderProps) {
  const breadcrumbs = customBreadcrumbs || []

  return (
    <header className='w-full flex h-14 shrink-0 items-center justify-between'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='cursor-pointer' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <div className='flex flex-col items-start'>
          {title && (
            <h1 className='text-lg font-semibold text-foreground'>{title}</h1>
          )}
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={item.path}>
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {item.isCurrent ? (
                      <BreadcrumbPage className='font-semibold text-xs'>
                        {item.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        className='font-semibold text-xs'
                        href={item.path}
                      >
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className='flex items-center gap-2 px-4'>
        {actions}
        <UploadImageModal />
        <NotificationButton />
      </div>
    </header>
  )
}

function UploadImageModal() {
  const [open, setOpen] = React.useState(false)
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)

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
      setUploadError('Failed to upload the image. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setUploadError(null)
  }

  return (
    <div className='px-2 py-2'>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>
        <Button
          onClick={handleOpen}
          variant='default'
          className='w-full flex items-center gap-2 cursor-pointer font-semibold bg-primary text-primary-foreground hover:bg-primary/90 data-[state=open]:bg-primary/90 data-[state=open]:text-primary-foreground'
        >
          <Sparkles size={16} />
          <span>Upload Image</span>
        </Button>
      </motion.div>

      <Credenza open={open} onOpenChange={setOpen}>
        <CredenzaContent className='p-4'>
          <CredenzaHeader>
            <CredenzaTitle>Upload Image</CredenzaTitle>
            <CredenzaDescription>
              Upload an image to analyze nutrition information
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            <FileUpload
              onUploadSuccess={setSelectedImage}
              onUploadError={setUploadError}
              acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']}
              maxFileSize={15 * 1024 * 1024} // 15MB
              currentFile={selectedImage}
              onFileRemove={handleReset}
            />
          </CredenzaBody>
          <CredenzaFooter className='flex justify-between'>
            <CredenzaClose asChild>
              <Button variant='outline' className='cursor-pointer'>
                <Ban size={12} />
                Cancel
              </Button>
            </CredenzaClose>
            <Button
              variant='default'
              onClick={handleSubmit}
              disabled={!selectedImage || isSubmitting}
              className='cursor-pointer'
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='animate-spin' size={12} />
                  Processing...
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

function NotificationButton() {
  const [hasNotifications] = React.useState(true) // In a real app, this would come from a context or API

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          {hasNotifications && (
            <span className='absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive' />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-80'>
        <div className='flex items-center justify-between p-2'>
          <p className='text-sm font-medium'>Notifications</p>
          <Button variant='ghost' size='sm' className='text-xs'>
            Mark all as read
          </Button>
        </div>
        <div className='max-h-96 overflow-y-auto py-1'>
          <DropdownMenuItem className='flex flex-col items-start p-3'>
            <p className='text-sm font-semibold'>New message</p>
            <p className='text-xs text-muted-foreground mt-1'>
              You have a new message from a user
            </p>
            <p className='text-xs text-muted-foreground mt-2'>2 minutes ago</p>
          </DropdownMenuItem>
          <DropdownMenuItem className='flex flex-col items-start p-3'>
            <p className='text-sm font-semibold'>Analysis completed</p>
            <p className='text-xs text-muted-foreground mt-1'>
              Your nutrition analysis is ready to view
            </p>
            <p className='text-xs text-muted-foreground mt-2'>1 hour ago</p>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
