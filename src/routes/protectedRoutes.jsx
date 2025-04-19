import { createHashRouter } from "react-router";
import Page from "@/app/dashboard/page"
import ProtectedLayout from "@/layouts/protected-layout";

export const protectedRoutes = createHashRouter([
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        path: "/",
        element: <Page />,
      },
      // {
      //   path: "/forgot-password",
      //   element: <ForgotPassword />,
      // },
    ],
  },
]);

export default protectedRoutes;