import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createHashRouter, RouterProvider} from "react-router-dom";
import AuthGuard from './Auth/guards/AuthGuard';
import App from "./App/pages/App";
import MyGamesAndCompetitions from './ChallengeGeneral/pages/MyGamesAndCompetitions';
import Competition from './Competition/pages/Competition';
import Login from './Auth/pages/Login';
import Register from './Auth/pages/Register';
import UnAuthGuard from './Auth/guards/UnAuthGuard';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Statistics from "./Statistics/page/Statistics";
import Layout from "./App/components/Layout";
import Profile from "./User/pages/Profile";
import Training from "./Training/pages/Training";
import AddTrainingEntry from "./Training/pages/AddTrainingEntry";
import CompetitionInvitation from "./Competition/pages/CompetitionInvitation";
import CreateStairClimbing from "./StairClimbing/pages/CreateStairClimbing";
import StairClimbing from "./StairClimbing/pages/StairClimbing";
import StairClimbingInvitation from "./StairClimbing/pages/StairClimbingInvitation";
import {route} from "react-router-typesafe-routes/dom";
import CreateCompetition from "./Competition/pages/CreateCompetition";

export const ROUTES = {
    root: route(""),
    games: route("games"),
    createStairClimbing: route("stair-climbing"),
    playStairClimbing: route("stair-climbing/:gameId"),
    inviteStairClimbing: route("stair-climbing/invite/:gameId"),
    createCompetition: route("competition"),
    playCompetition: route("competition/:competitionId"),
    inviteCompetition: route("competition/invite/:competitionId"),
    training: route("training"),
    newTrainingEntry: route("training/new"),
    stats: route("stats"),
    profile: route("profile"),
    login: route("login"),
    register: route("register"),
}

const router = createHashRouter([
    {
        path: ROUTES.root.path,
        element: <AuthGuard layout={Layout} component={App} redirectRoute={ROUTES.login.path}/>,
    },
    {
        path: ROUTES.games.path,
        element: <AuthGuard layout={Layout} component={MyGamesAndCompetitions} redirectRoute={ROUTES.login.path}/>,
    },

    /*
     * Stair Climbing
     */
    {
        path: ROUTES.createStairClimbing.path,
        element: <AuthGuard layout={Layout} component={CreateStairClimbing} redirectRoute={ROUTES.login.path}/>,
    },
    {
        path: ROUTES.playStairClimbing.path,
        element: <AuthGuard layout={Layout} component={StairClimbing} redirectRoute={ROUTES.login.path}/>,
    },
    {
        path: ROUTES.inviteStairClimbing.path,
        element: <AuthGuard layout={Layout} component={StairClimbingInvitation} redirectRoute={ROUTES.login.path}/>,
    },

    /*
     * Competition
     */
    {
        path: ROUTES.createCompetition.path,
        element: <AuthGuard layout={Layout} component={CreateCompetition} redirectRoute={ROUTES.login.path}/>,
    },
    {
        path: ROUTES.playCompetition.path,
        element: <AuthGuard layout={Layout} component={Competition} redirectRoute={ROUTES.login.path}/>,
    },
    {
        path: ROUTES.inviteCompetition.path,
        element: <AuthGuard layout={Layout} component={CompetitionInvitation} redirectRoute={ROUTES.login.path}/>,
    },

    /*
     * Training
     */
    {
        path: ROUTES.training.path,
        element: <AuthGuard layout={Layout} component={Training} redirectRoute={ROUTES.login.path}/>,
    },
    {
        path: ROUTES.newTrainingEntry.path,
        element: <AuthGuard layout={Layout} component={AddTrainingEntry} redirectRoute={ROUTES.login.path}/>,
    },

    {
        path: ROUTES.stats.path,
        element: <AuthGuard layout={Layout} component={Statistics} redirectRoute={ROUTES.login.path}/>,
    },
    {
        path: ROUTES.profile.path,
        element: <AuthGuard layout={Layout} component={Profile} redirectRoute={ROUTES.login.path}/>,
    },
    {
        path: ROUTES.login.path,
        element: <UnAuthGuard layout={Layout} component={Login} redirectRoute={ROUTES.root.path}/>,
    },
    {
        path: ROUTES.register.path,
        element: <UnAuthGuard layout={Layout} component={Register} redirectRoute={ROUTES.root.path}/>,
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
