import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import AuthGuard from "./guards/AuthGuard";
import App from "./pages/App/App";
import Login from "./pages/Login/Login";
import UnAuthGuard from "./guards/UnAuthGuard";
import Register from "./pages/Register/Register";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthGuard component={App} redirectRoute={"/login"}/>,
    },
    {
        path: "/login",
        element: <UnAuthGuard component={Login} redirectRoute={"/"}/>,
    },
    {
        path: "/register",
        element: <UnAuthGuard component={Register} redirectRoute={"/"}/>,
    },
])

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);
