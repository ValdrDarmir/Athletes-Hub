import React from "react";
import UserModel from "../../User/models/User.model";
import useUserCompetitionsOverview from "../../Competition/hooks/userCompetitionsOverview";
import CompetitionOverviewButton
    from "../../Competition/components/CompetitionOverviewButton";
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import Games, {gameNames} from "../models/Games";

interface Props {
    user: UserModel
}

function MyGamesAndCompetitions({user}: Props) {
    const [competitionOverviews, competitionOverviewsLoading, competitionOverviewsError] = useUserCompetitionsOverview(user.id)
    // TODO load games

    const loading = competitionOverviewsLoading
    const error = competitionOverviewsError

    if (loading) {
        return <p>{loading}</p>
    }

    if (error) {
        return <ErrorDisplay error={error}/>
    }

    return <div className="flex flex-col items-stretch w-full p-2">
        {competitionOverviews && competitionOverviews.length > 0 &&
            <>
                <h1 className="text-2xl">Wettbewerbe</h1>
                <ul className="menu">
                    {competitionOverviews.map(overview =>
                        <li key={overview.id} className="mb-2"><CompetitionOverviewButton overview={overview}/></li>
                    )}
                </ul>
            </>

        }
        {/*TODO show games*/}
        <h1 className="text-2xl">{gameNames[Games.StairClimbing]}</h1>
        <p>...</p>

    </div>
}

export default MyGamesAndCompetitions
