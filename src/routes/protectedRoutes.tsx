import { lazy } from 'react'
import { createHashRouter, Navigate } from 'react-router'

const ProtectedLayout = lazy(() => import('@/layouts/protected-layout'))
const Dashboard = lazy(() => import('@/app/dashboard/page'))
const AnalyticsPage = lazy(() => import('@/app/dashboard/analytics/page'))
const CalendarPage = lazy(() => import('@/app/calendar/page'))
// import { PageNotFoundPage } from "@/app/404-not-found/page";

// Define protected routes with proper typing
const protectedRoutes = createHashRouter([
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <Navigate to='/dashboard' replace />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/analytics',
        element: <AnalyticsPage />,
      },
      {
        path: '/calendar',
        element: <CalendarPage />,
      },
      // Add other protected routes here
      // {
      //   path: "*",
      //   element: <PageNotFoundPage />,
      // },
    ],
  },
])

export default protectedRoutes
