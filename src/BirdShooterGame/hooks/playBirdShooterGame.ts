import {useCollectionData} from "react-firebase-hooks/firestore";
import {doc, limit, query, updateDoc, where} from "firebase/firestore";
import User from "../../App/models/User";
import db from "../../shared/utils/db";
import {
    getCurrentRound, getCurrentPlayer,
    getHitsPerPlayer,
    getWinner,
    HitsPlayer
} from "../models/BirdShooterGameModel";


interface PlayBirdShooterGameHook {
    loading: boolean
    error: Error | null
    gameState: {
        currentPlayer: User
        currentRound: number
        maxRounds: number
        winner: User | null
        hitsPerPlayer: HitsPlayer[]
    } | null,
    gameActions: {
        newHit(score: number): Promise<void>
    } | null,
}

function usePlayBirdShooterGame(gameId: string | undefined): PlayBirdShooterGameHook {
    const [games, gameLoading, gameError] = useCollectionData(query(db.gameBirdShooter, where("id", "==", gameId), limit(1)))
    const game = (games && games.length > 0) ? games[0] : null
    const [players, playersLoading, playersError] = useCollectionData(game && query(db.users, where("id", "in", game.playerIds)))

    const loading = gameLoading || playersLoading
    const error = gameError || playersError

    // Error and loading handling
    if (loading || error || !game || !players) {
        const noGameIdError = !gameId && new Error("No game id was given.")
        const noGameOrPlayersError = (!game || !players) && new Error("No game or players found!?")

        return {
            loading: loading,
            error: error || noGameIdError || noGameOrPlayersError || null,
            gameActions: null,
            gameState: null,
        }
    }

    // Determine the current game state
    const gameState = {
        currentPlayer: getCurrentPlayer(game, players),
        currentRound: getCurrentRound(game),
        maxRounds: game.rounds,
        winner: getWinner(game, players),
        hitsPerPlayer: getHitsPerPlayer(game, players),
    }

    // Define Game actions
    const newHit = async (score: number) => {
        const currentPlayer = getCurrentPlayer(game, players)

        const newHit = {
            playerId: currentPlayer.id,
            score: score,
        }

        const newHits = [...game.hits, newHit]

        const docRef = doc(db.gameBirdShooter, game.id)
        await updateDoc(docRef, {
            hits: newHits,
        })
    }


    const gameActions = {
        newHit: newHit,
    }


    return {
        loading: false,
        error: null,
        gameState: gameState,
        gameActions: gameActions,
    }
}

export default usePlayBirdShooterGame
