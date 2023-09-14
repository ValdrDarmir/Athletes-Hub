import {useCollectionData} from "react-firebase-hooks/firestore";
import {or, query} from "firebase/firestore";
import db from "../../shared/utils/db";
import UserModel from "../../User/models/User.model";
import nonFalsy from "../../shared/utils/nonFalsy";
import separateErrors from "../../shared/utils/separateErrors";
import whereTyped from "../../shared/utils/whereTyped";
import BirdShooterGameModel from "../models/BirdShooterGame.model";
import useDebounceHook from "../../shared/hooks/debounceHook";

export interface BirdShooterGameOverview {
    id: string
    opponents: UserModel[]
}

type UserBirdShooterGamesHook =
    [BirdShooterGameOverview[], false, null] |
    [null, true, null] |
    [null, false, Error] |
    [null, false, null]

export default function useUserBirdShooterGamesOverview(userId: string): UserBirdShooterGamesHook {
    const [games, gamesLoading, gamesError] = useCollectionData(query(db.gameBirdShooter,
            or(whereTyped<BirdShooterGameModel>("participantIds", "array-contains", userId),
                whereTyped<BirdShooterGameModel>("creatorId", "==", userId))
        )
    )

    const allPlayersIds = games && games
        .map(game => game.participantSeries
            .map(ps => ps.participant.userId)
        )
        .flat()
        .concat("") // to prevent an empty array (firebase doesn't allow that)


    const [players, playersLoading, playersError] = useDebounceHook(useCollectionData(allPlayersIds && query(db.users, whereTyped<UserModel>("id", "in", allPlayersIds))))

    const loading = gamesLoading || playersLoading
    const error = gamesError || playersError

    if (loading) {
        return [null, true, null,]
    }

    if (error || !games || !players) {
        const noUserIdError = !userId && new Error("No user id was given.")
        const noGamesError = !games && new Error("No games found")
        const noOpponentsError = !players && new Error("No opponents found")
        const unknownError = new Error("Unknown error")

        const error = gamesError || playersError || noUserIdError || noGamesError || noOpponentsError || unknownError

        return [null, false, error,]
    }

    // TODO error is thrown too often. Initially not all players are loaded. Fix?
    const gameOverviews: BirdShooterGameOverview[] = games
        .map(game => {


            const [joinedParticipantSeries, joinErrors] = separateErrors(game.participantSeries.map(participantSeries => {
                    const user = players.find(user => user.id === participantSeries.participant.userId)
                    if (!user) {
                        return new Error(`User ${participantSeries.participant.userId} not found`)
                    }

                    return {
                        ...participantSeries,
                        user: user,
                    }
                }
            ))

            if (joinErrors.length > 0) {
                console.error(joinErrors)
            }

            const opponents = joinedParticipantSeries
                .filter(ps => ps.participant.userId !== userId)
                .map(ps => ps.user)

            return {
                id: game.id,
                opponents: opponents,
            }
        })
        .filter(nonFalsy)

    return [
        gameOverviews,
        false,
        null,
    ]
}
