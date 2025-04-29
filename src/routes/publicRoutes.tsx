import { RouteObject } from "react-router";
import { LoginPage } from "@/app/auth/login";
import { RegisterPage } from "@/app/auth/register";
import PublicLayout from "@/layouts/public-layout";
import { Navigate } from "react-router";
// import { PageNotFoundPage } from "@/app/404-not-found/page";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      // {
      //   path: "*",
      //   element: <PageNotFoundPage />,
      // },
    ],
  },
];

export default publicRoutes;
