import { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { Toaster } from '@/components/ui/sonner'
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router'
import protectedRoutes from './routes/protectedRoutes'
import publicRoutes from './routes/publicRoutes'
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
  const auth = useSelector((state: RootState) => state.auth);
  console.log('Auth State:', auth);
  console.log('User:', user);

  const publicRoutesArray = Array.isArray(publicRoutes)
    ? publicRoutes
    : publicRoutes?.routes || []

  const protectedRoutesArray = Array.isArray(protectedRoutes)
    ? protectedRoutes
    : protectedRoutes?.routes || []

  const enhancedPublicRoutes = createBrowserRouter([
    ...publicRoutesArray,
    { path: '*', element: <Navigate to='/' replace /> },
  ])

  const enhancedProtectedRoutes = createBrowserRouter([
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
