import usePlayCompetition, {AdditionalHookStates} from "../hooks/playCompetition";
import React from "react";
import UserModel from "../../User/models/User.model";
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import BeforeStartCompetition from "../components/BeforeStartCompetition";
import AfterCompetition from "../components/AfterCompetition";
import TimeRunning from "../components/TimeRunning";
import {CompetitionStates} from "../models/Competition.model";
import TurnIn from "../components/TurnIn";
import PreStartCountdown from "../components/PreStartCountdown";
import {useTypedParams} from "react-router-typesafe-routes/dom";
import {ROUTES} from "../../index";

interface Params {
    user: UserModel
}

function Competition({user}: Params) {
    const {competitionId} = useTypedParams(ROUTES.playCompetition)
    const game = usePlayCompetition(competitionId)

    switch (game.state) {
        case AdditionalHookStates.Loading:
            return <p>loading...</p>

        case AdditionalHookStates.Error:
            return <ErrorDisplay error={game.data}/>

        case CompetitionStates.BeforeStart:
            return <BeforeStartCompetition competitionId={competitionId} game={game} user={user}/>

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
