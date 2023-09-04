import {useParams} from "react-router-dom";
import usePlayBirdShooterGame, {GameStates} from "../hooks/playBirdShooterGame";
import React from "react";
import {toast} from "react-toastify";
import UserModel from "../../User/models/User.model";
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import useEffectWithPrevious from "../../shared/hooks/effectWithPrevious";
import BeforeBirdShooterGame from "../components/BeforeBirdShooterGame";
import AfterBirdShooterGame from "../components/AfterBirdShooterGame";
import InBirdShooterGame from "../components/InBirdShooterGame";

interface Params {
    user: UserModel
}

function BirdShooterGame({user}: Params) {
    const {gameId} = useParams()
    const game = usePlayBirdShooterGame(gameId)

    // Pop a toast when the game starts
    useEffectWithPrevious(([prevState]) => {
        if ((game.state !== prevState) && game.state === GameStates.InGame) {
            toast.info(`Das Spiel beginnt!`)
        }
    }, [game.state])


    if (!gameId) {
        return <ErrorDisplay error={new Error("No gameId provided")}/>
    }

    switch (game.state) {
        case GameStates.Loading:
            return <p>loading...</p>
        case GameStates.Error:
            return <ErrorDisplay error={game.data}/>
        case GameStates.BeforeGame:
            return <BeforeBirdShooterGame gameId={gameId} game={game} user={user}/>
        case GameStates.AfterGame:
            return <AfterBirdShooterGame game={game}/>
        case GameStates.InGame:
            return <InBirdShooterGame game={game}/>
        default:
            return <p>Unknown state</p>
    }
}

export default BirdShooterGame
