import { useEffect } from 'react'

/**
 * Hook to update document title
 * @param title Page specific title
 * @param siteName Optional site name to append/prepend
 */
export function useDocumentTitle(
  title: string,
  siteName = 'Bitewise Inc. | Nutrition | Health | Fitness'
) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | ${siteName}`
    } else {
      document.title = siteName
    }

    return () => {
      document.title = siteName
    }
  }, [title, siteName])
}
