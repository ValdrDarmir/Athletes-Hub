import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import User from "../../App/models/User";
import useCreateNewBirdShooterGame from "../../BirdShooterGame/hooks/createNewBirdShooterGame";
import Games from "../models/Games";
import SelectObject from "../../shared/components/SelectObject";

interface Props {
    user: User
}

function CreateGame({user}: Props) {

    const [createNewBirdShooterGame, createdNewBirdShooterGame, creationBirdShooterGameLoading] = useCreateNewBirdShooterGame()
    const navigate = useNavigate()
    const [selectedGame, setSelectedGame] = useState<Games>(Games.BirdShooter)

    useEffect(() => {
        if (createdNewBirdShooterGame) {
            navigate(`/game/${createdNewBirdShooterGame.id}`)
        }
    }, [createdNewBirdShooterGame, navigate])


    const startGameClicked = async () => {
        await createNewBirdShooterGame(user)
    }

    const gameSelectChanged = (value: Games) => {
        setSelectedGame(value)
    }

    return <div className="flex flex-col items-center m-2">
        <h1 className="text-2xl">Was willst du spielen?</h1>
        <div className="w-full">
            <SelectObject className="select select-bordered w-full" onChange={gameSelectChanged} value={selectedGame}>
                <option value={Games.BirdShooter}>Vogelschießen</option>
                <option disabled value="">Mehr kommt noch</option>
            </SelectObject>
        </div>

        <button className="btn btn-primary" disabled={!selectedGame || creationBirdShooterGameLoading}
                onClick={startGameClicked}>Los geht's!
        </button>
    </div>

}

export default CreateGame
