import { Suspense, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Toaster } from '@/components/ui/sonner'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router'
import protectedRoutes from './routes/protectedRoutes'
import publicRoutes from './routes/publicRoutes'
import { ThemeProvider } from '@/components/theme-provider'
import { RootState } from './types'
import socketClient from './sockets/socketClient'

const App = () => {
  const { user } = useSelector((state: RootState) => state.auth)

  // Check if the user is logged in and if the socket client is not connected
  // If the user is logged in, try to reconnect the socket client
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('socket_auth_token')
      if (token && !socketClient.isConnected()) {
        console.log('Reconnecting WebSocket after page refresh...')
        socketClient.connect(token)
      }
    }
  }, [user])

  const enhancedProtectedRoutes = createBrowserRouter([
    ...protectedRoutes,
    { path: '*', element: <Navigate to='/dashboard' replace /> },
  ])

  const enhancedPublicRoutes = createBrowserRouter([
    ...publicRoutes,
    { path: '*', element: <Navigate to='/login' replace /> },
  ])

  const routes = user ? enhancedProtectedRoutes : enhancedPublicRoutes

  return (
    <ThemeProvider>
      <Toaster richColors expand={true} />
      <Suspense fallback={<div className='spinner-border' role='status' />}>
        <RouterProvider key={user} router={routes} />
      </Suspense>
    </ThemeProvider>
  )
}

export default App
