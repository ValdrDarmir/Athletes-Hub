import React from 'react';
import {useNavigate, useParams} from "react-router-dom";
import User from "../../User/models/User";
import ClubDiscipline from "../../User/models/ClubDiscipline";
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import SelectObject from "../../shared/components/SelectObject";
import OptionObject from "../../shared/components/OptionObject";
import {disciplineNames} from "../../User/models/Disciplines";
import useInvitation from "../hooks/invitation";

interface Props {
    user: User
}

function Invitation({user}: Props) {
    const {entityId} = useParams()
    const {
        entity,
        isUserAlreadyAttending,
        validUserClubDisciplines,
        loading,
        error,
        addPlayer,
    } = useInvitation(entityId, user);

    const navigate = useNavigate()

    const [selectedClubDiscipline, setSelectedClubDiscipline] = React.useState<ClubDiscipline | null>(null)


    if (loading) {
        return <p>{loading}</p>
    }

    if (error) {
        return <ErrorDisplay error={error}/>
    }

    const onJoinButtonClicked = async () => {
        if (!selectedClubDiscipline) {
            return
        }
        await addPlayer(selectedClubDiscipline.id);
        navigate(`/game/${entityId}`)
    }

    if (isUserAlreadyAttending) {
        return <p>Du bist bereits dabei!</p>
    }

    if (validUserClubDisciplines.length === 0) {
        return <p>Du hast keinen Verein, der bei dieser Disziplin mitmachen kann.</p>
    }

    return (
        <div>
            <div className="flex flex-col gap-2">
                <p>Willst du mitmachen? Die Disziplin ist {disciplineNames[entity.discipline]}</p>
                <p>Mit welchem Verein trittst du an?</p>

                <SelectObject className="input input-bordered select" value={selectedClubDiscipline}
                              onChange={setSelectedClubDiscipline}>
                    <OptionObject value={null} disabled>Wähle deinen Verein</OptionObject>
                    {validUserClubDisciplines.map((clubDiscipline, i) =>
                        <OptionObject key={i} value={clubDiscipline}>{clubDiscipline.club}</OptionObject>
                    )}
                </SelectObject>

                <button className="btn" onClick={onJoinButtonClicked} disabled={selectedClubDiscipline === null}>
                    Bin dabei!
                </button>
            </div>
        </div>
    );
}

export default Invitation;
