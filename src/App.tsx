import { Suspense, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Toaster } from '@/components/ui/sonner'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router'
import protectedRoutes from './routes/protectedRoutes'
import publicRoutes from './routes/publicRoutes'
import { ThemeProvider } from '@/components/theme-provider'
import { RootState } from './types'

const App = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const [router, setRouter] = useState(() =>
    user
      ? createBrowserRouter([
          ...protectedRoutes,
          { path: '*', element: <Navigate to='/' replace /> },
        ])
      : createBrowserRouter([
          ...publicRoutes,
          { path: '*', element: <Navigate to='/' replace /> },
        ])
  )

  useEffect(() => {
    const newRouter = user
      ? createBrowserRouter([
          ...protectedRoutes,
          { path: '*', element: <Navigate to='/' replace /> },
        ])
      : createBrowserRouter([
          ...publicRoutes,
          { path: '*', element: <Navigate to='/' replace /> },
        ])

    setRouter(newRouter)
  }, [user])

  return (
    <ThemeProvider>
      <Toaster richColors expand={true} />
      <Suspense fallback={<div className='spinner-border' role='status' />}>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  )
}

export default App
