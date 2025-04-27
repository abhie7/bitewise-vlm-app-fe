'use client'

import { useState, useRef, useCallback, type DragEvent, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { UploadCloud, File as FileIcon, X, CheckCircle } from 'lucide-react'

type UploadStatus = 'idle' | 'dragging' | 'uploading' | 'success' | 'error'

interface FileUploadProps {
  onUploadSuccess?: (file: File) => void
  onUploadError?: (error: string) => void
  acceptedFileTypes?: string[] // e.g., ["image/png", "image/jpeg"]
  maxFileSize?: number // in bytes
  currentFile?: File | null // Add current file prop
  onFileRemove?: () => void // Add callback for file removal
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const dropzoneVariants = {
  idle: {
    scale: 1,
    borderColor: 'var(--border-color)',
    backgroundColor: 'var(--bg-color)',
  },
  dragging: {
    scale: 1.02,
    borderColor: 'var(--primary-color)',
    backgroundColor: 'var(--primary-bg)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
}

const iconVariants = {
  idle: { y: 0, scale: 1 },
  dragging: {
    y: -5,
    scale: 1.1,
    transition: {
      repeat: Number.POSITIVE_INFINITY,
      repeatType: 'reverse' as const,
      duration: 1,
      ease: 'easeInOut',
    },
  },
}

const progressVariants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: (progress: number) => ({
    pathLength: progress / 100,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  }),
}

const successIconVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
}

export default function FileUpload({
  onUploadSuccess,
  onUploadError,
  acceptedFileTypes,
  maxFileSize = 5 * 1024 * 1024, // Default 5MB
  currentFile: initialFile = null,
  onFileRemove,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(initialFile)
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize with current file if provided
  useEffect(() => {
    if (initialFile && initialFile !== file) {
      setFile(initialFile)
      setStatus('success')
      setProgress(100)
    }
  }, [initialFile, file])

  useEffect(() => {
    if (file?.type?.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    return () => setPreviewUrl(null)
  }, [file])

  const handleFileValidation = (selectedFile: File): boolean => {
    setError(null) // Reset error before validation
    if (
      acceptedFileTypes &&
      acceptedFileTypes.length > 0 &&
      !acceptedFileTypes.includes(selectedFile.type)
    ) {
      const err = `Invalid file type. Accepted: ${acceptedFileTypes
        .map((t) => t.split('/')[1])
        .join(', ')
        .toUpperCase()}`
      setError(err)
      setStatus('error')
      if (onUploadError) onUploadError(err)
      return false
    }
    if (maxFileSize && selectedFile.size > maxFileSize) {
      const err = `File size exceeds the limit of ${formatBytes(maxFileSize)}.`
      setError(err)
      setStatus('error')
      if (onUploadError) onUploadError(err)
      return false
    }
    return true
  }

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return

    if (!handleFileValidation(selectedFile)) {
      setFile(null) // Clear invalid file
      // Keep the error state active
      return
    }

    setFile(selectedFile)
    setError(null)
    setStatus('uploading')
    setProgress(0)
    // Simulate upload
    simulateUpload(selectedFile)
  }

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (status !== 'uploading' && status !== 'success') {
        setStatus('dragging')
      }
    },
    [status]
  ) // Depend on status

  const handleDragLeave = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (status === 'dragging') {
        setStatus('idle')
      }
    },
    [status]
  ) // Depend on status

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (status === 'uploading' || status === 'success') return // Don't allow drop during/after upload

      setStatus('idle')
      const droppedFile = e.dataTransfer.files?.[0]
      if (droppedFile) {
        handleFileSelect(droppedFile)
      }
    },
    [status]
  ) // Add dependencies

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    handleFileSelect(selectedFile || null)
    // Reset input value to allow selecting the same file again
    if (e.target) e.target.value = ''
  }

  const triggerFileInput = () => {
    if (status === 'uploading') return // Prevent opening dialog when uploading
    fileInputRef.current?.click()
  }

  const simulateUpload = (uploadingFile: File) => {
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.random() * 10 + 10 // Simulate progress increments
      if (currentProgress >= 100) {
        clearInterval(interval)
        setProgress(100)
        setStatus('success')
        if (onUploadSuccess) {
          onUploadSuccess(uploadingFile)
        }
      } else {
        // Check if still in uploading state before updating progress
        setStatus((prevStatus) => {
          if (prevStatus === 'uploading') {
            setProgress(currentProgress)
            return 'uploading'
          }
          // If status changed (e.g., user clicked reset), stop the simulation
          clearInterval(interval)
          return prevStatus
        })
      }
    }, 200) // Adjust interval for simulation speed
  }

  const resetState = () => {
    setFile(null)
    setStatus('idle')
    setProgress(0)
    setError(null)
    setPreviewUrl(null)
    if (onFileRemove) onFileRemove()
    // No need to reset fileInputRef.current.value here, handled in handleFileInputChange
  }

  const handleRemoveFile = useCallback(() => {
    setFile(null)
    setStatus('idle')
    setProgress(0)
    setError(null)
    setPreviewUrl(null)
    if (onFileRemove) onFileRemove()
  }, [onFileRemove])

  const formatBytes = (bytes: number, decimals = 2): string => {
    if (!+bytes) return '0 Bytes' // Use !+bytes to handle possible non-numeric input gracefully

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    // Ensure index is within bounds
    const unit = sizes[i] || sizes[sizes.length - 1]

    return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${unit}`
  }

  return (
    <motion.div
      variants={cardVariants}
      initial='initial'
      animate='animate'
      exit='exit'
      className='relative'
      style={
        {
          '--border-color': 'hsl(var(--border))',
          '--bg-color': 'hsl(var(--muted))',
          '--primary-color': 'hsl(var(--primary))',
          '--primary-bg': 'hsl(var(--primary) / 0.1)',
        } as React.CSSProperties
      }
    >
      <Card className='w-full mx-auto overflow-hidden min-h-[250px] flex flex-col border-border bg-card shadow-sm bg-gradient-to-br from-primary/10 via-transparent to-primary/5 '>
        <CardContent className='p-4 flex-1 flex flex-col items-center justify-center text-center relative'>
          <div className='relative z-10 w-full'>
            <AnimatePresence mode='wait' initial={false}>
              {file && (status === 'success' || status !== 'uploading') ? (
                <motion.div
                  key='preview'
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                  }}
                  className='flex flex-col items-center text-center w-full'
                  aria-live='polite'
                >
                  {previewUrl && (
                    <motion.div
                      className='relative w-32 h-32 mb-4 rounded-lg overflow-hidden ring-2 ring-primary/20'
                      initial={{
                        rotate: -10,
                        scale: 0.9,
                      }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <img
                        src={previewUrl}
                        alt={`Preview of ${file.name}`}
                        className='w-full h-full object-cover'
                      />
                    </motion.div>
                  )}
                  {!previewUrl && (
                    <FileIcon
                      className='w-16 h-16 mb-4 text-primary'
                      aria-hidden='true'
                    />
                  )}
                  <h3 className='text-lg font-semibold text-foreground mb-2'>
                    Current File
                  </h3>
                  <div className='w-full max-w-xs bg-muted/50 rounded-lg p-3 mb-4 backdrop-blur-sm'>
                    <p
                      className='text-sm font-medium text-foreground mb-2 truncate'
                      title={file.name}
                    >
                      {file.name}
                    </p>
                    <div className='grid grid-cols-2 gap-2 text-xs'>
                      <div className='flex flex-col space-y-1'>
                        <span className='text-muted-foreground'>Size</span>
                        <span className='font-medium text-foreground'>
                          {formatBytes(file.size)}
                        </span>
                      </div>
                      <div className='flex flex-col space-y-1'>
                        <span className='text-muted-foreground'>Type</span>
                        <span className='font-medium text-foreground'>
                          {file.type.split('/')[1].toUpperCase() || 'Unknown'}
                        </span>
                      </div>
                      <div className='flex flex-col space-y-1'>
                        <span className='text-muted-foreground'>Modified</span>
                        <span className='font-medium text-foreground'>
                          {new Date(file.lastModified).toLocaleDateString()}
                        </span>
                      </div>
                      <div className='flex flex-col space-y-1'>
                        <span className='text-muted-foreground'>Status</span>
                        <span className='font-medium text-green-600 dark:text-green-400'>
                          Ready
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => triggerFileInput()}
                      type='button'
                      className='px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer'
                      aria-label='Replace file'
                    >
                      Replace File
                    </button>
                    <button
                      onClick={handleRemoveFile}
                      type='button'
                      className='px-4 py-2 text-sm font-medium text-destructive hover:text-destructive/90 border border-destructive/30 hover:border-destructive/40 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 cursor-pointer'
                      aria-label='Remove file'
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              ) : status === 'idle' || status === 'dragging' ? (
                <motion.div
                  key='dropzone'
                  variants={dropzoneVariants}
                  initial='idle'
                  animate={status === 'dragging' ? 'dragging' : 'idle'}
                  className={`w-full h-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg
                                        ${
                                          status === 'dragging'
                                            ? 'border-primary/70 bg-primary/10'
                                            : 'border-primary hover:border-primary/50 hover:bg-primary/5 group cursor-pointer'
                                        } transition-all duration-300 ease-in-out backdrop-blur-sm relative overflow-hidden`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      triggerFileInput()
                    }
                  }}
                  aria-label='File upload dropzone'
                >
                  <div className='absolute inset-0 pointer-events-none'>
                    <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'>
                      <div className='absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 animate-shimmer' />
                      <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.05),transparent_90%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
                    </div>
                  </div>
                  <motion.div
                    variants={iconVariants}
                    initial='idle'
                    animate={status === 'dragging' ? 'dragging' : 'idle'}
                  >
                    <UploadCloud
                      className={`w-12 h-12 mb-4 ${
                        status === 'dragging'
                          ? 'text-primary'
                          : 'text-muted-foreground group-hover:text-primary group-hover:translate-y-[-2px]'
                      } transform transition-all duration-300 ease-out`}
                      aria-label='Upload cloud icon'
                    />
                  </motion.div>
                  <p className='mb-2 text-sm text-muted-foreground transition-all duration-300'>
                    <span className='font-semibold text-primary/90 group-hover:text-primary transition-colors duration-300'>
                      Click to upload
                    </span>{' '}
                    or drag and drop
                  </p>
                  <p className='text-xs text-muted-foreground/80 group-hover:text-muted-foreground transition-colors duration-300'>
                    {acceptedFileTypes && acceptedFileTypes.length > 0
                      ? `Accepted: ${acceptedFileTypes
                          .map((t) => t.split('/')[1])
                          .join(', ')
                          .toUpperCase()}`
                      : 'SVG, PNG, JPG or GIF'}{' '}
                    {maxFileSize && ` (Max ${formatBytes(maxFileSize)})`}
                  </p>
                  <input
                    ref={fileInputRef}
                    type='file'
                    className='sr-only'
                    onChange={handleFileInputChange}
                    accept={acceptedFileTypes?.join(',')}
                    aria-label='File input'
                  />
                </motion.div>
              ) : status === 'uploading' && file ? (
                <motion.div
                  key='uploading'
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                  }}
                  className='w-full flex flex-col items-center'
                  aria-live='polite'
                  aria-busy='true'
                >
                  <div className='w-16 h-16 mb-4 relative flex items-center justify-center'>
                    <motion.svg
                      className='w-full h-full transform -rotate-90'
                      viewBox='0 0 36 36'
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'linear',
                      }}
                      aria-label='Upload progress indicator'
                      role='progressbar'
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={progress}
                    >
                      <circle
                        cx='18'
                        cy='18'
                        r='16'
                        fill='none'
                        className='stroke-muted'
                        strokeWidth='2.5'
                      />
                      <motion.circle
                        cx='18'
                        cy='18'
                        r='16'
                        fill='none'
                        className='stroke-primary'
                        strokeWidth='2.5'
                        strokeDasharray='100'
                        variants={progressVariants}
                        initial='initial'
                        animate='animate'
                        custom={progress}
                      />
                    </motion.svg>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.2,
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      <FileIcon
                        className='w-8 h-8 absolute text-primary'
                        aria-hidden='true'
                      />
                    </motion.div>
                  </div>
                  <p
                    className='text-sm font-medium text-foreground mb-1 truncate max-w-[200px]'
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Uploading... {Math.round(progress)}%
                  </p>
                  <button
                    onClick={resetState}
                    type='button'
                    className='mt-4 px-3 py-1.5 text-xs font-medium text-destructive border border-destructive/30 hover:bg-destructive/10 rounded-md transition-all duration-300'
                    aria-label='Cancel upload'
                  >
                    Cancel
                  </button>
                </motion.div>
              ) : status === 'success' && file ? (
                <motion.div
                  key='success'
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                  }}
                  className='flex flex-col items-center text-center'
                  aria-live='polite'
                >
                  <div className='relative mb-4'>
                    <motion.div
                      className='absolute inset-0 blur-2xl bg-green-500/10 rounded-full'
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1.5 }}
                      transition={{
                        delay: 0.1,
                        duration: 0.8,
                        ease: 'easeOut',
                      }}
                    />
                    <motion.div
                      variants={successIconVariants}
                      initial='initial'
                      animate='animate'
                    >
                      <CheckCircle
                        className='w-16 h-16 text-green-500 dark:text-green-400 relative z-10 drop-shadow-lg'
                        aria-label='Success'
                      />
                    </motion.div>
                  </div>
                  <h3 className='text-lg font-semibold text-foreground mb-1'>
                    Upload Successful!
                  </h3>
                  <p
                    className='text-sm text-muted-foreground mb-4 truncate max-w-[200px]'
                    title={file.name}
                  >
                    {file.name} ({formatBytes(file.size)})
                  </p>
                  <button
                    onClick={resetState}
                    type='button'
                    className='px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-all duration-300 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
                    aria-label='Upload another file'
                  >
                    Upload Another File
                  </button>
                </motion.div>
              ) : status === 'error' ? (
                <motion.div
                  key='error'
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                    rotate: -10,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    rotate: 10,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                  }}
                  className='flex flex-col items-center text-center text-destructive'
                  role='alert'
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{
                      rotate: [0, -10, 10, -10, 10, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      ease: 'easeInOut',
                    }}
                  >
                    <X className='w-12 h-12 mb-3' aria-hidden='true' />
                  </motion.div>
                  <p className='text-sm font-medium mb-1'>Upload Failed</p>
                  <p className='text-xs mb-4 max-w-xs'>
                    {error || 'An unknown error occurred.'}
                  </p>
                  <button
                    onClick={resetState}
                    type='button'
                    className='px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md transition-all duration-300 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                    aria-label='Try uploading again'
                  >
                    Try Again
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
