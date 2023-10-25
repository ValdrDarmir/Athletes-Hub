import React from 'react';
import ClubDisciplineModel from "../../User/models/ClubDiscipline.model";
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import SelectObject from "../../shared/components/SelectObject";
import OptionObject from "../../shared/components/OptionObject";
import UserModel from "../../User/models/User.model";
import useCompetitionInvitation from "../hooks/competitionInvitation";

interface Props {
    competitionId: string
    user: UserModel
}

function CreatorJoin({competitionId, user}: Props) {
    const {
        isUserAlreadyAttending,
        validUserClubDisciplines,
        loading,
        error,
        addPlayer,
    } = useCompetitionInvitation(competitionId, user);

    const [selectedClubDiscipline, setSelectedClubDiscipline] = React.useState<ClubDisciplineModel | null>(null)


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
    }

    if (isUserAlreadyAttending) {
        return <p>Du bist dabei!</p>
    }

    if (validUserClubDisciplines.length === 0) {
        return <p>Du hast keinen Verein, der bei dieser Disziplin mitmachen kann.</p>
    }

    return (
        <div>
            <div className="flex flex-col gap-2">
                <p className="self-center">Möchtest du selbst teilnehmen?</p>

                <div className="flex justify-between max-w-full">
                    <SelectObject className="input input-bordered select" value={selectedClubDiscipline}
                                  onChange={setSelectedClubDiscipline}>
                        <OptionObject value={null} disabled>Dein Verein</OptionObject>
                        {validUserClubDisciplines.map((clubDiscipline, i) =>
                            <OptionObject key={i} value={clubDiscipline}>{clubDiscipline.club}</OptionObject>
                        )}
                    </SelectObject>

                    <button className="btn btn-secondary" onClick={onJoinButtonClicked} disabled={selectedClubDiscipline === null}>
                        Bin dabei!
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreatorJoin;
