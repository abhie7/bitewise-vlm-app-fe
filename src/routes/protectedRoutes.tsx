import { RouteObject } from "react-router";
import ProtectedLayout from "@/layouts/protected-layout";
import Dashboard from "@/app/dashboard/page";

// Define protected routes with proper typing
const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      // Add other protected routes here
    ],
  },
];

export default protectedRoutes;