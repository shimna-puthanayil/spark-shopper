import ReactDom from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Product from "./pages/Product";
import Order from "./pages/Order";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/login",
        element: <LoginForm />,
      },
      {
        path: "/signup",
        element: <SignupForm />,
      },
      {
        path: "/products/:id",
        element: <Product />,
      },
      {
        path: "/product",
        element: <Product />,
      },
      {
        path: "/order",
        element: <Order />,
      },
    ],
  },
]);

ReactDom.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
