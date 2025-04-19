import { createHashRouter } from "react-router";
import PublicLayout from "@/layouts/public-layout";
import {LoginPage} from "@/app/auth/login"
import Page from "@/app/dashboard/page"

export const publicRoutes = createHashRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <LoginPage />,
      },
      // {
      //   path: "/forgot-password",
      //   element: <ForgotPassword />,
      // },
    ],
  },
]);

export default publicRoutes;