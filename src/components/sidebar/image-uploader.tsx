import * as React from 'react'
import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useFileUpload } from "@/hooks/use-file-upload"
import { Button } from "@/components/ui/button"

interface ImageUploaderProps {
  onImageSelected?: (file: File | null) => void
  onReset?: () => void
}

export function ImageUploader({ onImageSelected, onReset }: ImageUploaderProps) {
  const maxSizeMB = 10
  const maxSize = maxSizeMB * 1024 * 1024 // 10MB default

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
      resetFiles,
    },
  ] = useFileUpload({
    accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
    maxSize,
  })

  const previewUrl = files[0]?.preview || null
  const file = files[0]?.file || null

  // Notify parent when file changes
  React.useEffect(() => {
    if (onImageSelected) {
      onImageSelected(file);
    }
  }, [file, onImageSelected]);

  const handleReset = () => {
    resetFiles();
    if (onReset) {
      onReset();
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        {/* Drop area */}
        <motion.div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-[input:focus]:ring-[3px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload image file"
          />
          <AnimatePresence mode="wait">
            {previewUrl ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center p-4"
              >
                <img
                  src={previewUrl}
                  alt={files[0]?.file?.name || "Uploaded image"}
                  className="mx-auto max-h-full rounded object-contain"
                />
              </motion.div>
            ) : (
              <motion.div
                key="upload-area"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center px-4 py-3 text-center"
              >
                <div
                  className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                  aria-hidden="true"
                >
                  <ImageIcon className="size-4 opacity-60" />
                </div>
                <p className="mb-1.5 text-sm font-medium">Drop your image here</p>
                <p className="text-muted-foreground text-xs">
                  SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={openFileDialog}
                >
                  <UploadIcon
                    className="-ms-1 size-4 opacity-60"
                    aria-hidden="true"
                  />
                  Select image
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {previewUrl && (
          <motion.div
            className="absolute top-4 right-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={() => removeFile(files[0]?.id)}
              aria-label="Remove image"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-destructive flex items-center gap-1 text-xs"
            role="alert"
          >
            <AlertCircleIcon className="size-3 shrink-0" />
            <span>{errors[0]}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
