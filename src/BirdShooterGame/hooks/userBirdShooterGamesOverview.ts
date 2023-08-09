import {useCollectionData} from "react-firebase-hooks/firestore";
import {FirestoreError, query, where} from "firebase/firestore";
import db from "../../shared/utils/db";
import User from "../../App/models/User";
import {
    getAttendingPlayers,
    getCurrentRound,
    getWinner
} from "../models/BirdShooterGameModel";

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
    const allOpponentsIds = games && games.map(game => game.playerIds).flat().filter(id => id !== userId)

    const [opponents, opponentsLoading, opponentsError] = useCollectionData(allOpponentsIds && query(db.users, where("id", "in", allOpponentsIds)))

    const loading = gamesLoading || opponentsLoading
    const error = gamesError || opponentsError

    // Error and loading handling
    if (loading || error || !games || !opponents) {
        const noUserIdError = !userId && new Error("No user id was given.")
        const noGameOrOpponentsError = (!games || !opponents) && new Error("No games or opponents found!?")

        return [
            null,
            loading,
            error || noUserIdError || noGameOrOpponentsError || null,
        ]
    }

    const gameOverviews = games.map((game): BirdShooterGameOverview => ({
        id: game.id,
        winner: getWinner(game, opponents),
        round: getCurrentRound(game),
        maxRounds: game.rounds,
        opponents: getAttendingPlayers(game, opponents),
    }))

    return [
        gameOverviews,
        false,
        null,
    ]
}
