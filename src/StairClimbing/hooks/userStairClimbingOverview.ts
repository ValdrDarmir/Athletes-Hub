import {useCollectionData} from "react-firebase-hooks/firestore";
import {or, query} from "firebase/firestore";
import db from "../../shared/utils/db";
import UserModel from "../../User/models/User.model";
import nonFalsy from "../../shared/utils/nonFalsy";
import separateErrors from "../../shared/utils/separateErrors";
import whereTyped from "../../shared/utils/whereTyped";
import useDebounceHook from "../../shared/hooks/debounceHook";
import StairClimbingModel from "../models/StairClimbing.model";
import Disciplines from "../../User/models/Disciplines";

export interface StairClimbingOverview {
    id: string
    opponents: UserModel[]
    discipline: Disciplines
    startDate: Date
}

type UserStairClimbingOverviewHook =
    [StairClimbingOverview[], false, null] |
    [null, true, null] |
    [null, false, Error] |
    [null, false, null]

export default function useUserStairClimbingOverview(userId: string): UserStairClimbingOverviewHook {
    const [games, gamesLoading, gamesError] = useCollectionData(query(db.stairClimbing,
            or(whereTyped<StairClimbingModel>("playerIds", "array-contains", userId),
                whereTyped<StairClimbingModel>("creatorId", "==", userId))
        )
    )

    const allPlayersIds = games && games
        .map(game => game.playerIds)
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

    const gameOverviews: StairClimbingOverview[] = games
        .map(game => {

            const [gamePlayers, joinErrors] = separateErrors(game.playerIds.map(playerId => {
                    const user = players.find(user => user.id === playerId)
                    if (!user) {
                        return new Error(`User ${playerId} not found`)
                    }

                    return user
                }
            ))

            if (joinErrors.length > 0) {
                console.error(joinErrors)
            }

            const opponents = gamePlayers
                .filter(ps => ps.id !== userId)

            return {
                id: game.id,
                opponents: opponents,
                discipline: game.discipline,
                startDate: game.createdAt,
            }
        })
        .filter(nonFalsy)

    return [
        gameOverviews,
        false,
        null,
    ]
}
