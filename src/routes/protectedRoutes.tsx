import { RouteObject } from "react-router";
import ProtectedLayout from "@/layouts/protected-layout";
import Dashboard from "@/app/dashboard/page";
import AnalyticsPage from "@/app/dashboard/analytics/page";
import { Navigate } from "react-router";
// import { PageNotFoundPage } from "@/app/404-not-found/page";

// Define protected routes with proper typing
const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/analytics",
        element: <AnalyticsPage />,
      },
      // Add other protected routes here
      // {
      //   path: "*",
      //   element: <PageNotFoundPage />,
      // },
    ],
  },
];

export default protectedRoutes;