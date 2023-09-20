import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import UserModel from "../../User/models/User.model";
import Games, {gameNames} from "../models/Games";
import SelectObject from "../../shared/components/SelectObject";
import OptionObject from "../../shared/components/OptionObject";
import {toast} from "react-toastify";
import useCreateNewStairClimbing from "../../StairClimbing/hooks/createNewStairClimbing";

interface Props {
    user: UserModel
}

function CreateGame({user}: Props) {

    const [createNewStairClimbing, creationStairClimbingLoading, creationStairClimbingError] = useCreateNewStairClimbing()
    const navigate = useNavigate()
    const [selectedGame, setSelectedGame] = useState<Games>(Games.StairClimbing)

    const startGameClicked = async () => {
        const newGameDoc = await createNewStairClimbing(user)
        if (newGameDoc) {
            toast.success("Spiel erstellt 👍")
            navigate(`/game/${newGameDoc.id}`)
        }
    }

    const gameSelectChanged = (value: Games) => {
        setSelectedGame(value)
    }

    return <div className="flex flex-col items-center m-2 gap-2">
        <h1 className="text-2xl">Spiel erstellen</h1>
        <h1 className="text-xl">Was willst du spielen?</h1>
        <div className="w-full">
            <SelectObject className="select select-bordered w-full" onChange={gameSelectChanged} value={selectedGame}>
                <OptionObject value={Games.StairClimbing}>{gameNames[Games.StairClimbing]}</OptionObject>
                <OptionObject disabled value="">Mehr kommt noch</OptionObject>
            </SelectObject>
        </div>

        {creationStairClimbingError &&
            <div className="text-error">{creationStairClimbingError.message}</div>
        }
        <button className="btn btn-primary" disabled={!selectedGame || creationStairClimbingLoading}
                onClick={startGameClicked}>Los geht's!
        </button>
    </div>

}

export default CreateGame
