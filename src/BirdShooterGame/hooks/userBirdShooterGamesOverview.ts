import {useCollectionData} from "react-firebase-hooks/firestore";
import {FirestoreError, or, query, where} from "firebase/firestore";
import db from "../../shared/utils/db";
import User from "../../User/models/User";
import {
    getAttendingPlayers,
    getCurrentRound,
    getWinner
} from "../models/BirdShooterGame";
import nonFalsy from "../../shared/utils/nonFalsy";

export interface BirdShooterGameOverview {
    id: string
    winner: User | null
    opponents: User[]
    round: number
    maxRounds: number
}

type UserBirdShooterGamesHook = [BirdShooterGameOverview[] | null, boolean, Error | FirestoreError | null]

export default function useUserBirdShooterGamesOverview(userId: string | undefined): UserBirdShooterGamesHook {
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

    // Error and loading handling
    if (loading || error || !games || !players) {
        const noUserIdError = !userId && new Error("No user id was given.")
        const noGamesError = !games && new Error("No games found")
        const noOpponentsError = !players && new Error("No opponents found")

        return [
            null,
            loading,
            error || noUserIdError || noGamesError || noOpponentsError || null,
        ]
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
