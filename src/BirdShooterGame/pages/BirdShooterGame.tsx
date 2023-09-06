import {useParams} from "react-router-dom";
import usePlayBirdShooterGame, {AdditionalHookStates} from "../hooks/playBirdShooterGame";
import React from "react";
import UserModel from "../../User/models/User.model";
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import BeforeBirdShooterGame from "../components/BeforeBirdShooterGame";
import AfterBirdShooterGame from "../components/AfterBirdShooterGame";
import TimeRunningBirdShooterGame from "../components/TimeRunningBirdShooterGame";
import {BirdShooterGameStates} from "../models/BirdShooterGame.model";
import TurnInBirdShooterGame from "../components/TurnInBirdShooterGame";
import PreGameCountdownBirdShooterGame from "../components/PreGameCountdownBirdShooterGame";

interface Params {
    user: UserModel
}

function BirdShooterGame({user}: Params) {
    const {gameId} = useParams()
    const game = usePlayBirdShooterGame(gameId)

    if (!gameId) {
        return <ErrorDisplay error={new Error("No gameId provided")}/>
    }

    switch (game.state) {
        case AdditionalHookStates.Loading:
            return <p>loading...</p>

        case AdditionalHookStates.Error:
            console.log(game.data)
            return <ErrorDisplay error={game.data}/>

        case BirdShooterGameStates.BeforeGame:
            return <BeforeBirdShooterGame gameId={gameId} game={game} user={user}/>

        case BirdShooterGameStates.PreGameCountDown:
            return <PreGameCountdownBirdShooterGame game={game} />

        case BirdShooterGameStates.TimeRunning:
            return <TimeRunningBirdShooterGame user={user} game={game}/>

        case BirdShooterGameStates.TurnIn:
            return <TurnInBirdShooterGame game={game} user={user} />

        case BirdShooterGameStates.AfterGame:
            return <AfterBirdShooterGame game={game}/>
    }
}

export default BirdShooterGame
