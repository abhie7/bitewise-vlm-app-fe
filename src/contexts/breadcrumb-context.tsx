import React, { createContext, useContext, useState } from 'react'
import { BreadcrumbItem } from '@/components/header/header'

interface BreadcrumbContextType {
  breadcrumbs: BreadcrumbItem[]
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void
  updateBreadcrumb: (breadcrumb: BreadcrumbItem) => void
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined)

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])

  const updateBreadcrumb = (breadcrumb: BreadcrumbItem) => {
    setBreadcrumbs(prev => {
      const index = prev.findIndex(item => item.path === breadcrumb.path)
      if (index >= 0) {
        const updated = [...prev]
        updated[index] = { ...updated[index], ...breadcrumb }
        return updated
      }
      return [...prev, breadcrumb]
    })
  }

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs, updateBreadcrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext)
  if (context === undefined) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider')
  }
  return context
}
