import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import UserModel from "../../User/models/User.model";
import useCreateNewCompetition from "../../Competition/hooks/createNewCompetition";
import SelectObject from "../../shared/components/SelectObject";
import Disciplines, {disciplineNames} from "../../User/models/Disciplines";
import OptionObject from "../../shared/components/OptionObject";
import {toast} from "react-toastify";
import {routes} from "../../routes";

interface Props {
    user: UserModel
}

function CreateGame({user}: Props) {

    const [createNewCompetition, creationCompetitionLoading, creationCompetitionError] = useCreateNewCompetition()
    const navigate = useNavigate()
    const [discipline, setDiscipline] = useState<Disciplines>(Disciplines.AirRifle)

    const startGameClicked = async () => {
        const newGameDoc = await createNewCompetition(user, discipline)
        if (newGameDoc) {
            toast.success("Spiel erstellt 👍")
            navigate(routes.playCompetition.buildPath({competitionId: newGameDoc.id}))
        }
    }

    const disciplineSelectChanged = (value: Disciplines) => {
        setDiscipline(value)
    }

    return <div className="flex flex-col items-center m-2 gap-2">
        <h1 className="text-2xl">Wettbewerb erstellen</h1>
        <h1 className="text-xl">In welcher Diziplin?</h1>
        <div className="w-full">
            <SelectObject className="select select-bordered w-full" onChange={disciplineSelectChanged}
                          value={discipline}>
                <OptionObject value={Disciplines.AirRifle}>{disciplineNames[Disciplines.AirRifle]}</OptionObject>
                <OptionObject value={Disciplines.Pistol}>{disciplineNames[Disciplines.Pistol]}</OptionObject>
            </SelectObject>
        </div>
        {creationCompetitionError &&
            <div className="text-error">{creationCompetitionError.message}</div>
        }
        <button className="btn btn-primary" disabled={creationCompetitionLoading}
                onClick={startGameClicked}>Los geht's!
        </button>
    </div>

}

export default CreateGame
