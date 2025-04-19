import { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { Toaster } from '@/components/ui/sonner'
import { RouterProvider, createHashRouter, Navigate } from 'react-router'
import protectedRoutes from '@/routes/protectedRoutes'
import publicRoutes from '@/routes/publicRoutes'
import { ThemeProvider } from '@/components/theme-provider'

interface User {
  id: string
  email: string
  userName: string
  role: string | Record<string, string>
}

interface AuthState {
  user: User | null
  isAuthLoading: boolean
  isAuthError: string | null
  isAuthSuccess: boolean
  token: string | null
}

interface RootState {
  auth: AuthState
}

const App = () => {
  const { user } = useSelector((state: RootState) => state.auth)

  // Handle both array format and object with routes property
  const publicRoutesArray = Array.isArray(publicRoutes)
    ? publicRoutes
    : (publicRoutes?.routes || []);

  const protectedRoutesArray = Array.isArray(protectedRoutes)
    ? protectedRoutes
    : (protectedRoutes?.routes || []);

  const enhancedPublicRoutes = createHashRouter([
    ...publicRoutesArray,
    { path: '*', element: <Navigate to='/' replace /> },
  ])

  const enhancedProtectedRoutes = createHashRouter([
    ...protectedRoutesArray,
    { path: '*', element: <Navigate to='/' replace /> },
  ])

  return (
    <ThemeProvider>
      <Toaster richColors expand={true} />
      <Suspense fallback={<div className='spinner-border' role='status' />}>
        {user ? (
          <RouterProvider router={enhancedProtectedRoutes} />
        ) : (
          <RouterProvider router={enhancedPublicRoutes} />
        )}
      </Suspense>
    </ThemeProvider>
  )
}

export default App
