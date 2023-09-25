import React from "react";
import UserModel from "../../User/models/User.model";
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import usePlayStairClimbing, {AdditionalHookStates} from "../hooks/playStairClimbing";
import {StairClimbingStates} from "../models/StairClimbing.model";
import FinishedStairClimbing from "../components/FinishedStairClimbing";
import RunningStairClimbing from "../components/RunningStairClimbing";
import PreStartCountdownStairClimbing from "../components/PreStartCountdownStairClimbing";
import BeforeStartStairClimbing from "../components/BeforeStartStairClimbing";
import {useTypedParams} from "react-router-typesafe-routes/dom";
import {ROUTES} from "../../index";

interface Params {
    user: UserModel
}

function StairClimbing({user}: Params) {
    const {gameId} = useTypedParams(ROUTES.playStairClimbing)
    const game = usePlayStairClimbing(gameId, user)

    switch (game.state) {
        case AdditionalHookStates.Loading:
            return <p>loading...</p>

        case AdditionalHookStates.Error:
            return <ErrorDisplay error={game.data}/>

        case StairClimbingStates.BeforeStart:
            return <BeforeStartStairClimbing gameId={gameId} game={game} user={user}/>

        case StairClimbingStates.PreStartCountDown:
            return <PreStartCountdownStairClimbing game={game} />

        case StairClimbingStates.Running:
            return <RunningStairClimbing user={user} game={game}/>

        case StairClimbingStates.Finished:
            return <FinishedStairClimbing game={game}/>
    }
}

export default StairClimbing
