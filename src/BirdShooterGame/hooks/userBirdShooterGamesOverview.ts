import {useCollectionData} from "react-firebase-hooks/firestore";
import {or, query, where} from "firebase/firestore";
import db from "../../shared/utils/db";
import UserModel from "../../User/models/User.model";
import {
    getAttendingPlayers,
    getCurrentRound,
    getWinner
} from "../models/BirdShooterGame.model";
import nonFalsy from "../../shared/utils/nonFalsy";

export interface BirdShooterGameOverview {
    id: string
    winner: UserModel | null
    opponents: UserModel[]
    round: number
    maxRounds: number
}

type UserBirdShooterGamesHook =
    [BirdShooterGameOverview[], false, null] |
    [null, true, null] |
    [null, false, Error] |
    [null, false, null]

export default function useUserBirdShooterGamesOverview(userId: string): UserBirdShooterGamesHook {
    const [games, gamesLoading, gamesError] = useCollectionData(query(db.gameBirdShooter,
            or(where("playerIds", "array-contains", userId),
                where("creatorId", "==", userId))
        )
    );

    const allPlayersIds = games && games
        .map(game => game.participants
            .map(participant => participant.userId)
        )
        .flat()
        .concat("") // to prevent an empty array (firebase doesn't allow that)


    const [players, playersLoading, playersError] = useCollectionData(allPlayersIds && query(db.users, where("id", "in", allPlayersIds)))

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

            const gamePlayers = getAttendingPlayers(game, players)
            if (gamePlayers instanceof Error) {
                console.error(gamePlayers.message)
                return null;
            }

            const winner = getWinner(game, gamePlayers)

            if (winner instanceof Error) {
                console.error(winner.message)
                return null;
            }

            const opponents = gamePlayers.filter(player => player.id !== userId)

            return {
                id: game.id,
                winner: winner,
                round: getCurrentRound(game),
                maxRounds: game.rounds,
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
