import { RouteObject } from "react-router";
import { LoginPage } from "@/app/auth/login";
// import Register from "@/app/auth/register/page";
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
      // {
      //   path: "/register",
      //   element: <Register />,
      // },
      // Add other public routes here
    ],
  },
];

export default publicRoutes;
