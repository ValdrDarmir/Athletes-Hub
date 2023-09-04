import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import UserModel from "../../User/models/User.model";
import useCreateNewBirdShooterGame from "../../BirdShooterGame/hooks/createNewBirdShooterGame";
import Games from "../models/Games";
import SelectObject from "../../shared/components/SelectObject";
import Disciplines, {disciplineNames} from "../../User/models/Disciplines";
import OptionObject from "../../shared/components/OptionObject";
import {toast} from "react-toastify";

interface Props {
    user: UserModel
}

function CreateGame({user}: Props) {

    const [createNewBirdShooterGame, creationBirdShooterGameLoading, creationBirdShooterGameError] = useCreateNewBirdShooterGame()
    const navigate = useNavigate()
    const [selectedGame, setSelectedGame] = useState<Games>(Games.BirdShooter)
    const [discipline, setDiscipline] = useState<Disciplines>(Disciplines.AirRifle)

    const startGameClicked = async () => {
        const newGameDoc = await createNewBirdShooterGame(user, discipline)
        if (newGameDoc) {
            // navigate(`/game/${newGameDoc.id}`)
            toast.success("Challenge erstellt")
            navigate(`/`)
        }
    }

    const gameSelectChanged = (value: Games) => {
        setSelectedGame(value)
    }

    const disciplineSelectChanged = (value: Disciplines) => {
        setDiscipline(value)
    }

    return <div className="flex flex-col items-center m-2 gap-2">
        <h1 className="text-2xl">Was willst du spielen?</h1>
        <div className="w-full">
            <SelectObject className="select select-bordered w-full" onChange={gameSelectChanged} value={selectedGame}>
                <OptionObject value={Games.BirdShooter}>Vogelschießen</OptionObject>
                <OptionObject disabled value="">Mehr kommt noch</OptionObject>
            </SelectObject>
        </div>

        <h1 className="text-2xl">In welcher Diziplin?</h1>
        <div className="w-full">
            <SelectObject className="select select-bordered w-full" onChange={disciplineSelectChanged}
                          value={discipline}>
                <OptionObject value={Disciplines.AirRifle}>{disciplineNames[Disciplines.AirRifle]}</OptionObject>
                <OptionObject value={Disciplines.Pistol}>{disciplineNames[Disciplines.Pistol]}</OptionObject>
            </SelectObject>
        </div>
        {creationBirdShooterGameError &&
            <div className="text-error">{creationBirdShooterGameError.message}</div>
        }
        <button className="btn btn-primary" disabled={!selectedGame || creationBirdShooterGameLoading}
                onClick={startGameClicked}>Los geht's!
        </button>
    </div>

}

export default CreateGame
