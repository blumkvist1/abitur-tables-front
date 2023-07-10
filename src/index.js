import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ErrorPage from "./pages/ErrorPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainTable from "./pages/MainTable";
import ProgramPage from "./pages/ProgramPage";
import AbiturList from "./pages/AbiturList";
import UserPage from "./pages/UserPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <AbiturList />,

        //element: <MainTable />,
      },
      {
        path: "/program/:name",
        element: <ProgramPage />,
      },
      {
        path: "/program/:name/learn_profile/:nameProf",
        element: <AbiturList />,
      },
		{
			path: "/abiturient/:snils",
			element: <UserPage/>
		 },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
