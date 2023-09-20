import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createHashRouter, RouterProvider} from "react-router-dom";
import AuthGuard from './Auth/guards/AuthGuard';
import App from "./App/pages/App";
import CreateGame from './ChallengeGeneral/pages/CreateGame';
import MyGamesAndCompetitions from './ChallengeGeneral/pages/MyGamesAndCompetitions';
import Competition from './Competition/pages/Competition';
import Login from './Auth/pages/Login';
import Register from './Auth/pages/Register';
import UnAuthGuard from './Auth/guards/UnAuthGuard';
import Invitation from "./ChallengeGeneral/pages/Invitation";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Statistics from "./Statistics/page/Statistics";
import Layout from "./App/components/Layout";
import Profile from "./User/pages/Profile";
import Training from "./Training/pages/Training";
import AddTrainingEntry from "./Training/pages/AddTrainingEntry";
import CreateCompetition from "./ChallengeGeneral/pages/CreateCompetition";

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
        element: <AuthGuard layout={Layout} component={MyGamesAndCompetitions} redirectRoute={"/login"}/>,
    },
    {
        path: "/game/:gameId",
        element: <AuthGuard layout={Layout} component={() => <p>TODO Game</p>} redirectRoute={"/login"}/>,
    },
    {
        path: "/competition",
        element: <AuthGuard layout={Layout} component={CreateCompetition} redirectRoute={"/login"}/>,
    },
    {
        path: "/competition/:competitionId",
        element: <AuthGuard layout={Layout} component={Competition} redirectRoute={"/login"}/>,
    },
    {
        path: "/invite/:entityId",
        element: <AuthGuard layout={Layout} component={Invitation} redirectRoute={"/login"}/>,
    },
    {
        path: "/training",
        element: <AuthGuard layout={Layout} component={Training} redirectRoute={"/login"}/>,
    },
    {
        path: "/training/new",
        element: <AuthGuard layout={Layout} component={AddTrainingEntry} redirectRoute={"/login"}/>,
    },
    {
        path: "/stats",
        element: <AuthGuard layout={Layout} component={Statistics} redirectRoute={"/login"}/>,
    },
    {
        path: "/profile",
        element: <AuthGuard layout={Layout} component={Profile} redirectRoute={"/login"}/>,
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
