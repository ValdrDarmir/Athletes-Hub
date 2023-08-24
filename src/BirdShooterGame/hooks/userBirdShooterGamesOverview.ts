import {useCollectionData} from "react-firebase-hooks/firestore";
import {FirestoreError, query, where} from "firebase/firestore";
import db from "../../shared/utils/db";
import User from "../../App/models/User";
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
    const [games, gamesLoading, gamesError] = useCollectionData(query(db.gameBirdShooter, where("playerIds", "array-contains", userId)));
    const allPlayersIds = games && games.map(game => game.playerIds).flat()

    const [players, playersLoading, playersError] = useCollectionData(allPlayersIds && query(db.users, where("id", "in", allPlayersIds)))

    const loading = gamesLoading || playersLoading
    const error = gamesError || playersError

    // Error and loading handling
    if (loading || error || !games || !players) {
        const noUserIdError = !userId && new Error("No user id was given.")
        const noGameOrOpponentsError = (!games || !players) && new Error("No games or opponents found!?")

        return [
            null,
            loading,
            error || noUserIdError || noGameOrOpponentsError || null,
        ]
    }

    // TODO error is thrown to often. Initially not all players are loaded. Fix?
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
