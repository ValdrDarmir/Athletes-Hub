import {useNavigate} from "react-router-dom";
import UserModel from "../../User/models/User.model";
import ClubDisciplineModel from "../../User/models/ClubDiscipline.model";
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import SelectObject from "../../shared/components/SelectObject";
import OptionObject from "../../shared/components/OptionObject";
import {disciplineNames} from "../../User/models/Disciplines";
import useCompetitionInvitation from "../hooks/competitionInvitation";
import {useState} from "react";
import {ROUTES} from "../../index";
import {useTypedParams} from "react-router-typesafe-routes/dom";

interface Props {
    user: UserModel
}

function Invitation({user}: Props) {
    const {competitionId} = useTypedParams(ROUTES.playCompetition)
    const {
        competition,
        isUserAlreadyAttending,
        validUserClubDisciplines,
        loading,
        error,
        addPlayer,
    } = useCompetitionInvitation(competitionId, user);

    const navigate = useNavigate()

    const [selectedClubDiscipline, setSelectedClubDiscipline] = useState<ClubDisciplineModel | null>(null)


    if (loading) {
        return <p>loading...</p>
    }

    if (error) {
        return <ErrorDisplay error={error}/>
    }

    const onJoinButtonClicked = async () => {
        if (!selectedClubDiscipline) {
            return
        }
        await addPlayer(selectedClubDiscipline.id);
        navigate(ROUTES.playCompetition.buildPath({competitionId: competitionId}))
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
                <p>Willst du mitmachen? Die Disziplin ist {disciplineNames[competition.discipline]}</p>
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
