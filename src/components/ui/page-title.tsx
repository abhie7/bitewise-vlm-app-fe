import { useDocumentTitle } from "@/hooks/use-document-title"

interface PageTitleProps {
  title: string
  siteName?: string
  children?: React.ReactNode
}

/**
 * Component that updates document title and optionally renders children
 */
export function PageTitle({ title, siteName, children }: PageTitleProps) {
  useDocumentTitle(title, siteName)

  return children ? <>{children}</> : null
}
