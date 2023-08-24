import React from "react";
import User from "../../../App/models/User";
import useUserBirdShooterGamesOverview from "../../../BirdShooterGame/hooks/userBirdShooterGamesOverview";
import BirdShooterOverviewButton
    from "../../../BirdShooterGame/components/BirdShooterOverviewButton";

interface Props {
    user: User
}

function MyGames({user}: Props) {
    const [birdShooterOverviews, birdShooterOverviewsLoading, birdShooterOverviewsError] = useUserBirdShooterGamesOverview(user.id)

    const loading = birdShooterOverviewsLoading
    const error = birdShooterOverviewsError

    if (loading) {
        return <p>{loading}</p>
    }

    if (error) {
        return <p className="text-error">{error.message}</p>
    }

    return <div className="flex flex-col items-stretch w-full p-2">
        {birdShooterOverviews && birdShooterOverviews.length > 0 &&
            <>
                <h1 className="text-2xl">Vogelschützen</h1>
                <ul className="menu">
                    {birdShooterOverviews.map(overview =>
                        <li key={overview.id} className="mb-2"><BirdShooterOverviewButton overview={overview}/></li>
                    )}
                </ul>
            </>

        }
    </div>
}

export default MyGames
