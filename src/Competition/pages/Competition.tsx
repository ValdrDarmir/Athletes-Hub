import {useParams} from "react-router-dom";
import usePlayCompetition, {AdditionalHookStates} from "../hooks/playCompetition";
import React from "react";
import UserModel from "../../User/models/User.model";
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import BeforeStartCompetition from "../components/BeforeStartCompetition";
import AfterCompetition from "../components/AfterCompetition";
import TimeRunning from "../components/TimeRunning";
import {CompetitionStates} from "../models/CompetitionModel";
import TurnIn from "../components/TurnIn";
import PreStartCountdown from "../components/PreStartCountdown";

interface Params {
    user: UserModel
}

function Competition({user}: Params) {
    const {gameId} = useParams()
    const game = usePlayCompetition(gameId)

    if (!gameId) {
        return <ErrorDisplay error={new Error("No gameId provided")}/>
    }

    switch (game.state) {
        case AdditionalHookStates.Loading:
            return <p>loading...</p>

        case AdditionalHookStates.Error:
            return <ErrorDisplay error={game.data}/>

        case CompetitionStates.BeforeStart:
            return <BeforeStartCompetition gameId={gameId} game={game} user={user}/>

        case CompetitionStates.PreStartCountDown:
            return <PreStartCountdown game={game} />

        case CompetitionStates.TimeRunning:
            return <TimeRunning user={user} game={game}/>

        case CompetitionStates.TurnIn:
            return <TurnIn game={game} user={user} />

        case CompetitionStates.AfterCompetition:
            return <AfterCompetition game={game}/>
    }
}

export default Competition
