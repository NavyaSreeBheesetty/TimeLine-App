import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import Root from "./components/root";
import Login from "./components/login";
import Auth from "./components/auth";
import ErrorPage from "./components/error";
import TaskChart from "./components/ToDoChart";
import TimeChart from "./components/TimeChart";
import ExpenseTracker from "./components/ExpenseTracker";
import BugReport from "./components/BugReport";
import LeaveReport from "./components/LeaveReport";
import Home from "./components/Home";
// import Cookies from "universal-cookie";


// export default function App() {
// const cookie=new Cookies();
// const user=cookie.get("username");
// console.log(user);


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "login",
        element: <Login/>,
      },
      {
         path:"",
         element:<Home/>
      },
      {
        path: "ToDo",
        element: < TaskChart/>,
      },
      {
        path: "TimeChart",
        element: < TimeChart/>,
      },
      {
        path:"ExpenseTracker",
        element:< ExpenseTracker/>,
      },
      {
        path:"BugReport",
        element:< BugReport/>,
      },
      {
        path:"LeaveReport",
        element:< LeaveReport/>,
      },
      // {
      //   path:"ExpenseTracker",
      //   element:<ExpenseTracker/>,
      // },
      {
        path: "timeline/authenticate",
        element: <Auth />,
      },
      {
        path: "*",
        element: <ErrorPage/>,
      },
    ],
  },
]);

export default function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
