import React from 'react'
import { Suspense, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Toaster } from '@/components/ui/sonner'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router'
import protectedRoutes from './routes/protectedRoutes'
import publicRoutes from './routes/publicRoutes'
import { ThemeProvider } from '@/components/theme-provider'
import { RootState } from './types'
import socketClient from './sockets/socketClient'
import { fetchUserNutrition } from './services/nutritionService'
import { useAppDispatch } from './services/store'
import { Spinner } from './components/ui/spinner'

const App = () => {
  const { user, isAuthSuccess } = useSelector((state: RootState) => state.auth)

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

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (isAuthSuccess && user) {
      const token = localStorage.getItem('socket_auth_token')
      console.log('Fetching user nutrition data...')
      dispatch(fetchUserNutrition(token))
    }
  }, [isAuthSuccess, user, dispatch])

  const enhancedProtectedRoutes = createBrowserRouter([
    ...protectedRoutes.routes,
    { path: '*', element: <Navigate to='/dashboard' replace /> },
  ])

  const enhancedPublicRoutes = createBrowserRouter([
    ...publicRoutes.routes,
    { path: '*', element: <Navigate to='/login' replace /> },
  ])

  return (
    <ThemeProvider>
      <Toaster richColors expand={true} />
      <Suspense
        key={user}
        fallback={
          <div
            className='spinner-border flex flex-col gap-1 items-center justify-center w-full h-screen'
            role='status'
          >
            <Spinner variant='infinite' className='size-12 text-primary' />
          </div>
        }
      >
        <React.Fragment key={user}>
          {user ? (
              <RouterProvider router={enhancedProtectedRoutes} />
          ) : (
            <RouterProvider router={enhancedPublicRoutes} />
          )}
        </React.Fragment>
      </Suspense>
    </ThemeProvider>
  )
}

export default App
