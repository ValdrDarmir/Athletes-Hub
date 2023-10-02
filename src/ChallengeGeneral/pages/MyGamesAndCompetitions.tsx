import React from "react";
import UserModel from "../../User/models/User.model";
import useUserCompetitionsOverview from "../../Competition/hooks/userCompetitionsOverview";
import CompetitionOverviewButton
    from "../../Competition/components/CompetitionOverviewButton";
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import Games, {gameNames} from "../models/Games";
import useUserStairClimbingOverview from "../../StairClimbing/hooks/userStairClimbingOverview";
import StairClimbingOverviewButton from "../../StairClimbing/components/StairClimbingOverviewButton";

interface Props {
    user: UserModel
}

function MyGamesAndCompetitions({user}: Props) {
    const [competitionOverviews, competitionOverviewsLoading, competitionOverviewsError] = useUserCompetitionsOverview(user.id)
    const [stairClimbingOverviews, stairClimbingOverviewsLoading, stairClimbingOverviewsError] = useUserStairClimbingOverview(user.id)

    return <div className="flex flex-col items-stretch w-full p-2">
        {competitionOverviewsLoading && <p>loading...</p>}
        {competitionOverviewsError && <ErrorDisplay error={competitionOverviewsError}/>}
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

        {stairClimbingOverviewsLoading && <p>loading...</p>}
        {stairClimbingOverviewsError && <ErrorDisplay error={stairClimbingOverviewsError}/>}
        {stairClimbingOverviews && stairClimbingOverviews.length > 0 &&
            <>
                <h1 className="text-2xl">{gameNames[Games.StairClimbing]}</h1>
                <ul className="menu">
                    {stairClimbingOverviews.map(overview =>
                        <li key={overview.id} className="mb-2"><StairClimbingOverviewButton overview={overview}/></li>
                    )}
                </ul>
            </>

        }

    </div>
}

export default MyGamesAndCompetitions
