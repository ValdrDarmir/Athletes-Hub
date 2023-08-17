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
import findFirstError from "../../shared/utils/findFirstError";


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
        newHit(score: number): Promise<Error | undefined>
    } | null,
}

function newErrorResult(error: Error) {
    return {
        loading: false,
        error: error,
        gameActions: null,
        gameState: null,
    }
}

function usePlayBirdShooterGame(gameId: string | undefined): PlayBirdShooterGameHook {
    const [games, gameLoading, gameError] = useCollectionData(query(db.gameBirdShooter, where("id", "==", gameId), limit(1)))
    const game = (games && games.length > 0) ? games[0] : null
    const [players, playersLoading, playersError] = useCollectionData(game && query(db.users, where("id", "in", game.playerIds)))

    // Custom Errors
    const noGameIdError = !gameId && new Error("No game id was given.")
    const noGameOrPlayersError = (!game || !players) && new Error("No game or players found!?")

    const loading = gameLoading || playersLoading
    const error = gameError || playersError || noGameIdError || noGameOrPlayersError

    // Initial error and loading handling
    if(loading){
        return {
            loading: loading,
            error: null,
            gameActions: null,
            gameState: null,
        }
    }

    if (error || !game || !players) {
        const unknownError = new Error("Some error happened") // This should not happen
        return newErrorResult(error || unknownError)
    }

    const currentPlayer = getCurrentPlayer(game, players)
    const currentRound = getCurrentRound(game)
    const maxRounds = game.rounds
    const winner = getWinner(game, players)
    const hitsPerPlayer = getHitsPerPlayer(game, players)

    // TODO better streamline throwing errors. This is the only short way I found, that typescript accepts
    if(currentPlayer instanceof Error || winner instanceof Error || hitsPerPlayer instanceof Error){
        const error = findFirstError(currentPlayer, winner, hitsPerPlayer)
        const unknownError = new Error("Some error happened") // This should not happen
        return newErrorResult(error || unknownError)
    }

    // Determine the current game state
    const gameState = {
        currentPlayer: currentPlayer,
        currentRound: currentRound,
        maxRounds: maxRounds,
        winner: winner,
        hitsPerPlayer: hitsPerPlayer,
    }

    // Define Game actions
    const newHit = async (score: number) => {
        const currentPlayer = getCurrentPlayer(game, players)

        if (currentPlayer instanceof Error) {
            return currentPlayer
        }

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
