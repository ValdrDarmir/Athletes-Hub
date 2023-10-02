import {route} from "react-router-typesafe-routes/dom";
import {createHashRouter} from "react-router-dom";
import AuthGuard from "./Auth/guards/AuthGuard";
import Layout from "./App/components/Layout";
import App from "./App/pages/App";
import MyGamesAndCompetitions from "./ChallengeGeneral/pages/MyGamesAndCompetitions";
import CreateStairClimbing from "./StairClimbing/pages/CreateStairClimbing";
import StairClimbing from "./StairClimbing/pages/StairClimbing";
import StairClimbingInvitation from "./StairClimbing/pages/StairClimbingInvitation";
import CreateCompetition from "./Competition/pages/CreateCompetition";
import Competition from "./Competition/pages/Competition";
import CompetitionInvitation from "./Competition/pages/CompetitionInvitation";
import Training from "./Training/pages/Training";
import AddTrainingEntry from "./Training/pages/AddTrainingEntry";
import Statistics from "./Statistics/page/Statistics";
import Profile from "./User/pages/Profile";
import UnAuthGuard from "./Auth/guards/UnAuthGuard";
import Login from "./Auth/pages/Login";
import Register from "./Auth/pages/Register";
import React from "react";

export const routes = {
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

export const router = createHashRouter([
    {
        path: routes.root.path,
        element: <AuthGuard layout={Layout} component={App} redirectRoute={routes.login.path}/>,
    },
    {
        path: routes.games.path,
        element: <AuthGuard layout={Layout} component={MyGamesAndCompetitions} redirectRoute={routes.login.path}/>,
    },

    /*
     * Stair Climbing
     */
    {
        path: routes.createStairClimbing.path,
        element: <AuthGuard layout={Layout} component={CreateStairClimbing} redirectRoute={routes.login.path}/>,
    },
    {
        path: routes.playStairClimbing.path,
        element: <AuthGuard layout={Layout} component={StairClimbing} redirectRoute={routes.login.path}/>,
    },
    {
        path: routes.inviteStairClimbing.path,
        element: <AuthGuard layout={Layout} component={StairClimbingInvitation} redirectRoute={routes.login.path}/>,
    },

    /*
     * Competition
     */
    {
        path: routes.createCompetition.path,
        element: <AuthGuard layout={Layout} component={CreateCompetition} redirectRoute={routes.login.path}/>,
    },
    {
        path: routes.playCompetition.path,
        element: <AuthGuard layout={Layout} component={Competition} redirectRoute={routes.login.path}/>,
    },
    {
        path: routes.inviteCompetition.path,
        element: <AuthGuard layout={Layout} component={CompetitionInvitation} redirectRoute={routes.login.path}/>,
    },

    /*
     * Training
     */
    {
        path: routes.training.path,
        element: <AuthGuard layout={Layout} component={Training} redirectRoute={routes.login.path}/>,
    },
    {
        path: routes.newTrainingEntry.path,
        element: <AuthGuard layout={Layout} component={AddTrainingEntry} redirectRoute={routes.login.path}/>,
    },

    {
        path: routes.stats.path,
        element: <AuthGuard layout={Layout} component={Statistics} redirectRoute={routes.login.path}/>,
    },
    {
        path: routes.profile.path,
        element: <AuthGuard layout={Layout} component={Profile} redirectRoute={routes.login.path}/>,
    },
    {
        path: routes.login.path,
        element: <UnAuthGuard layout={Layout} component={Login} redirectRoute={routes.root.path}/>,
    },
    {
        path: routes.register.path,
        element: <UnAuthGuard layout={Layout} component={Register} redirectRoute={routes.root.path}/>,
    },
])
