import { RouteObject } from "react-router";
import { LoginPage } from "@/app/auth/login";
import { RegisterPage } from "@/app/auth/register";
import PublicLayout from "@/layouts/public-layout";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
];

export default publicRoutes;
