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
    const [discipline, setDiscipline] = useState<Disciplines | null>(null)

    const startGameClicked = async () => {
        if (!discipline) {
            return;
        }
        const newGameDoc = await createNewCompetition(user, discipline)
        if (newGameDoc) {
            toast.success("Spiel erstellt 👍")
            navigate(routes.playCompetition.buildPath({competitionId: newGameDoc.id}))
        }
    }

    const disciplineSelectChanged = (value: Disciplines) => {
        setDiscipline(value)
    }

    return <div className="flex flex-col items-center m-8 gap-8">

        <h1 className="text-3xl text-primary mt-5 uppercase">Wettbewerb</h1>

        <h1 className="">Erstelle einen neuen Wettbewerb:</h1>

        <div className="w-full">
            <SelectObject className="select select-bordered w-full" onChange={disciplineSelectChanged}
                          value={discipline}>
                <OptionObject value={null} disabled>Diszipin</OptionObject>
                <OptionObject value={Disciplines.AirRifle}>{disciplineNames[Disciplines.AirRifle]}</OptionObject>
                <OptionObject value={Disciplines.Pistol}>{disciplineNames[Disciplines.Pistol]}</OptionObject>
            </SelectObject>
        </div>
        {creationCompetitionError &&
            <div className="text-error">{creationCompetitionError.message}</div>
        }
        <button className="btn btn-secondary w-full" disabled={creationCompetitionLoading || !discipline}
                onClick={startGameClicked}>Los geht's!
        </button>

        <p className="text-center">Fordere deine Freunde mit einem Wettkampf nach Liga-Modus (40 Schuss) heraus. Trage nach jeder Serie deine erreichte Punktzahl ein und siehe in Echtzeit den Stand der Teilnehmenden!</p>
    </div>

}

export default CreateGame
