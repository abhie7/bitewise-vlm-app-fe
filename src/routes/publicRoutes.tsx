import { lazy } from 'react'
import { createHashRouter, Navigate } from 'react-router'
const LoginPage = lazy(() => import('@/app/auth/login'))
const RegisterPage = lazy(() => import('@/app/auth/register'))
const PublicLayout = lazy(() => import('@/layouts/public-layout'))
// import { PageNotFoundPage } from "@/app/404-not-found/page";

const publicRoutes = createHashRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Navigate to='/login' replace />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      // {
      //   path: "*",
      //   element: <PageNotFoundPage />,
      // },
    ],
  },
])

export default publicRoutes
