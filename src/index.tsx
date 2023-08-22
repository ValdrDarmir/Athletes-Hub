import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createHashRouter, RouterProvider} from "react-router-dom";
import AuthGuard from './Auth/guards/AuthGuard';
import App from "./App/pages/App/App";
import CreateGame from './GamesGeneral/pages/CreateGame/CreateGame';
import MyGames from './GamesGeneral/pages/MyGames/MyGames';
import BirdShooterGame from './BirdShooterGame/pages/BirdShooterGame/BirdShooterGame';
import Login from './Auth/pages/Login/Login';
import Register from './Auth/pages/Register/Register';
import UnAuthGuard from './Auth/guards/UnAuthGuard';
import Invitation from "./GamesGeneral/pages/Invitation/Invitation";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const router = createHashRouter([
    {
        path: "/",
        element: <AuthGuard component={App} redirectRoute={"/login"}/>,
    },
    {
        path: "/game",
        element: <AuthGuard component={CreateGame} redirectRoute={"/login"}/>,
    },
    {
        path: "/games",
        element: <AuthGuard component={MyGames} redirectRoute={"/login"}/>,
    },
    {
        path: "/game/:gameId",
        element: <AuthGuard component={BirdShooterGame} redirectRoute={"/login"}/>,
    },
    {
        path: "/invite/:entityId",
        element: <AuthGuard component={Invitation} redirectRoute={"/login"}/>,
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
