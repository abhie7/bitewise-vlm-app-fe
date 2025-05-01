import React from 'react'
import {
  Bell,
  Sparkles,
  WandSparkles,
  Loader2,
  Ban,
  RefreshCcw,
} from 'lucide-react'
import { Link } from 'react-router'
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
import { toast } from 'sonner'

import { motion } from 'framer-motion'
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
import minioService from '@/services/minioService'
import socketClient from '@/sockets/socketClient'
import { useSelector } from 'react-redux'
import { NutritionResultModal } from '../nutrition/nutrition-result-modal'
import { useAppDispatch } from '@/services/store'
import { fetchUserNutrition } from '@/services/nutritionService'

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
    <header className='app-header'>
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
                      <BreadcrumbLink className='font-semibold text-xs' asChild>
                        <Link to={item.path}>{item.label}</Link>
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
        <RefetchDataButton />
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
  const [analysisStatus, setAnalysisStatus] = React.useState<
    'idle' | 'analyzing' | 'complete' | 'error'
  >('idle')
  const [analysisProgress, setAnalysisProgress] = React.useState(0)
  const [analysisMessage, setAnalysisMessage] = React.useState('')
  const [nutritionResult, setNutritionResult] = React.useState<any>(null)
  const [showResultsModal, setShowResultsModal] = React.useState(false)
  const user = useSelector((state: any) => state.auth)
  const userId = user?.user?.uuid || user?.user?.data?.uuid || 'guest'

  // Handle saved nutrition data
  const handleAnalysisComplete = (data: any) => {
    setAnalysisStatus('complete')
    setAnalysisProgress(100)
    setAnalysisMessage('Analysis complete!')
    setIsSubmitting(false)
    setNutritionResult(data)

    // Store the nutrition data in local storage or state management
    if (data.id) {
      // If we have an ID, the data was saved on the server
      localStorage.setItem(`nutrition-${data.id}`, JSON.stringify(data))
      toast.success(`Analysis complete!`)
    } else {
      toast.success('Analysis complete!')
    }

    // Show the results modal after a short delay
    setTimeout(() => {
      setShowResultsModal(true)
      // Close the upload modal
      setOpen(false)

      // Reset the form for future uploads
      setTimeout(() => {
        setSelectedImage(null)
        setAnalysisStatus('idle')
        setAnalysisProgress(0)
        setAnalysisMessage('')
      }, 500)
    }, 1000)
  }

  // Set up event listeners for socket events
  React.useEffect(() => {
    // Set up socket event handlers
    const handleAnalysisStart = () => {
      setAnalysisStatus('analyzing')
      setAnalysisProgress(0)
      setAnalysisMessage('Starting analysis...')
    }

    const handleAnalysisProgress = (data: {
      progress: number
      message: string
    }) => {
      setAnalysisProgress(data.progress)
      setAnalysisMessage(data.message)
    }

    const handleAnalysisError = (errorMsg: string) => {
      setAnalysisStatus('error')
      setUploadError(errorMsg)
      setIsSubmitting(false)
      toast.error(`Analysis failed: ${errorMsg}`)
    }

    // Register socket event handlers
    socketClient.onAnalysisStart(handleAnalysisStart)
    socketClient.onAnalysisProgress(handleAnalysisProgress)
    socketClient.onAnalysisComplete(handleAnalysisComplete)
    socketClient.onAnalysisError(handleAnalysisError)

    // Clean up event handlers when component unmounts
    return () => {
      socketClient.offAnalysisStart(handleAnalysisStart)
      socketClient.offAnalysisProgress(handleAnalysisProgress)
      socketClient.offAnalysisComplete(handleAnalysisComplete)
      socketClient.offAnalysisError(handleAnalysisError)
    }
  }, [])

  const handleOpen = () => {
    setOpen(true)
  }

  const handleSubmit = async () => {
    if (!selectedImage) return

    setIsSubmitting(true)
    setUploadError(null)
    setAnalysisStatus('analyzing')
    setAnalysisProgress(0)
    setAnalysisMessage('Uploading image...')

    try {
      // 1. Upload the image to MinIO
      const uploadResult = await minioService.uploadSingleFile(
        userId,
        selectedImage
      )

      // 2. Send the image URL to the backend via WebSockets
      if (!socketClient.isConnected()) {
        throw new Error(
          'Not connected to the server. Please refresh the page and try again.'
        )
      }

      // Use the requestImageAnalysis method from socketClient
      socketClient.requestImageAnalysis({
        imageUrl: uploadResult.url,
        imageId: uploadResult.objectName,
        fileName: selectedImage.name,
        fileType: selectedImage.type,
        fileSize: selectedImage.size,
      })

      toast.success('Image sent for analysis!')

      // Note: Don't close modal or reset form here - wait for analysis to complete
      // The socket event handlers will manage the UI based on analysis progress
    } catch (error) {
      console.error('Error processing image:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      setUploadError(`Failed to upload the image: ${errorMessage}`)
      setAnalysisStatus('error')
      toast.error(`Upload failed: ${errorMessage}`)
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setUploadError(null)
    setAnalysisStatus('idle')
    setAnalysisProgress(0)
    setAnalysisMessage('')
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
            {analysisStatus === 'analyzing' && selectedImage ? (
              <div className='flex flex-col items-center space-y-4 p-6'>
                <div className='relative w-full h-4 bg-muted rounded-full overflow-hidden'>
                  <div
                    className='absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-in-out'
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
                <p className='text-sm text-muted-foreground'>
                  {analysisMessage}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {analysisProgress}% complete
                </p>
                {uploadError && (
                  <p className='text-sm text-destructive mt-2'>{uploadError}</p>
                )}
              </div>
            ) : (
              <FileUpload
                onUploadSuccess={setSelectedImage}
                onUploadError={setUploadError}
                acceptedFileTypes={[
                  'image/jpeg',
                  'image/png',
                  'image/webp',
                  'image/svg+xml',
                ]}
                maxFileSize={15 * 1024 * 1024} // 15MB
                currentFile={selectedImage}
                onFileRemove={handleReset}
              />
            )}
          </CredenzaBody>
          <CredenzaFooter className='flex justify-between'>
            <CredenzaClose asChild>
              <Button
                variant='outline'
                className='cursor-pointer'
                disabled={isSubmitting}
              >
                <Ban size={12} />
                Cancel
              </Button>
            </CredenzaClose>
            <Button
              variant='default'
              onClick={handleSubmit}
              disabled={
                !selectedImage || isSubmitting || analysisStatus === 'analyzing'
              }
              className='cursor-pointer'
            >
              {isSubmitting || analysisStatus === 'analyzing' ? (
                <>
                  <Loader2 className='animate-spin mr-2' size={12} />
                  {analysisStatus === 'analyzing'
                    ? 'Analyzing...'
                    : 'Processing...'}
                </>
              ) : (
                <>
                  <WandSparkles size={12} className='mr-2' />
                  Analyze Image
                </>
              )}
            </Button>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>

      {/* Add the Nutrition Results Modal */}
      <NutritionResultModal
        open={showResultsModal}
        onOpenChange={setShowResultsModal}
        result={nutritionResult}
      />
    </div>
  )
}

function RefetchDataButton() {
  const dispatch = useAppDispatch()
  const loading = useSelector((state: any) => state.nutrition.loading)
  const handleRefetch = () => {
    const token = localStorage.getItem('socket_auth_token')
    dispatch(fetchUserNutrition(token))
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={handleRefetch}
      className='cursor-pointer'
      disabled={loading}
    >
      {loading ? (
        <Loader2 className='animate-spin h-5 w-5' />
      ) : (
        <RefreshCcw className='h-5 w-5' />
      )}
    </Button>
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
