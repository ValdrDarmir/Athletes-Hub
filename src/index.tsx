import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createHashRouter, RouterProvider} from "react-router-dom";
import AuthGuard from './Auth/guards/AuthGuard';
import App from "./App/pages/App";
import CreateGame from './GamesGeneral/pages/CreateGame/CreateGame';
import MyGames from './GamesGeneral/pages/MyGames/MyGames';
import BirdShooterGame from './BirdShooterGame/pages/BirdShooterGame';
import Login from './Auth/pages/Login/Login';
import Register from './Auth/pages/Register/Register';
import UnAuthGuard from './Auth/guards/UnAuthGuard';
import Invitation from "./GamesGeneral/pages/Invitation/Invitation";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Statistics from "./Statistics/page/Statistics";
import Layout from "./App/components/Layout/Layout";

const router = createHashRouter([
    {
        path: "/",
        element: <AuthGuard layout={Layout} component={App} redirectRoute={"/login"}/>,
    },
    {
        path: "/game",
        element: <AuthGuard layout={Layout} component={CreateGame} redirectRoute={"/login"}/>,
    },
    {
        path: "/games",
        element: <AuthGuard layout={Layout} component={MyGames} redirectRoute={"/login"}/>,
    },
    {
        path: "/game/:gameId",
        element: <AuthGuard layout={Layout} component={BirdShooterGame} redirectRoute={"/login"}/>,
    },
    {
        path: "/invite/:entityId",
        element: <AuthGuard layout={Layout} component={Invitation} redirectRoute={"/login"}/>,
    },
    {
        path: "/stats",
        element: <AuthGuard layout={Layout} component={Statistics} redirectRoute={"/login"}/>,
    },
    {
        path: "/login",
        element: <UnAuthGuard layout={Layout} component={Login} redirectRoute={"/"}/>,
    },
    {
        path: "/register",
        element: <UnAuthGuard layout={Layout} component={Register} redirectRoute={"/"}/>,
    },
])

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <div>
            <RouterProvider router={router}/>
            <ToastContainer
                hideProgressBar={true}
                autoClose={2000}
                closeButton={false}
                position="top-right"
            />
        </div>
    </React.StrictMode>
);
