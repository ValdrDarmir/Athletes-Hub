import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import UserModel from "../../User/models/User.model";
import SelectObject from "../../shared/components/SelectObject";
import OptionObject from "../../shared/components/OptionObject";
import {toast} from "react-toastify";
import useCreateNewStairClimbing from "../../StairClimbing/hooks/createNewStairClimbing";
import Games, {gameNames} from "../../ChallengeGeneral/models/Games";
import Disciplines, {disciplineNames} from "../../User/models/Disciplines";
import {routes} from "../../routes";

interface Props {
    user: UserModel
}

function CreateStairClimbing({user}: Props) {

    const [createNewStairClimbing, creationStairClimbingLoading, creationStairClimbingError] = useCreateNewStairClimbing()
    const navigate = useNavigate()
    const [selectedGame, setSelectedGame] = useState<Games>(Games.StairClimbing)
    const [discipline, setDiscipline] = useState<Disciplines>(Disciplines.AirRifle)

    const [stepGoalAmount, setStepGoalAmount] = useState<number>(5)

    const startGameClicked = async () => {
        const newGameDoc = await createNewStairClimbing(user, discipline, stepGoalAmount)
        if (newGameDoc) {
            toast.success("Spiel erstellt 👍")
            navigate(routes.playStairClimbing.buildPath({gameId: newGameDoc.id}))
        }
    }

    return <div className="flex flex-col items-center m-2 gap-2">
        <h1 className="text-2xl">Spiel erstellen</h1>
        <h1 className="text-xl">Was willst du spielen?</h1>
        <div className="w-full">
            <SelectObject className="select select-bordered w-full" onChange={setSelectedGame} value={selectedGame}>
                <OptionObject value={Games.StairClimbing}>{gameNames[Games.StairClimbing]}</OptionObject>
                <OptionObject disabled value="">Mehr kommt noch</OptionObject>
            </SelectObject>
        </div>

        {creationStairClimbingError &&
            <div className="text-error">{creationStairClimbingError.message}</div>
        }

        {selectedGame === Games.StairClimbing &&
            <>
                <h1 className="text-xl">In welcher Diziplin?</h1>
                <div className="w-full">
                    <SelectObject className="select select-bordered w-full" onChange={setDiscipline}
                                  value={discipline}>
                        <OptionObject value={Disciplines.AirRifle}>{disciplineNames[Disciplines.AirRifle]}</OptionObject>
                        <OptionObject value={Disciplines.Pistol}>{disciplineNames[Disciplines.Pistol]}</OptionObject>
                    </SelectObject>
                </div>
                <h1 className="text-lg">Wie viele Stufen?</h1>
                <SelectObject className="select select-bordered w-full" value={stepGoalAmount}
                              onChange={setStepGoalAmount}>
                    <OptionObject value={5}>5 Stufen</OptionObject>
                    <OptionObject value={10}>10 Stufen</OptionObject>
                    <OptionObject value={15}>15 Stufen</OptionObject>
                </SelectObject>
            </>
        }

        <button className="btn btn-primary" disabled={!selectedGame || creationStairClimbingLoading}
                onClick={startGameClicked}>Los geht's!
        </button>
    </div>

}

export default CreateStairClimbing
