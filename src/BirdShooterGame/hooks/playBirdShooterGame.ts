import {useCollectionData} from "react-firebase-hooks/firestore";
import {doc, limit, query, setDoc, where} from "firebase/firestore";
import User from "../../App/models/User";
import db from "../../shared/utils/db";
import {
    getCurrentRound, getCurrentPlayer,
    getHitsPerPlayer,
    getWinner,
    HitsPlayer, getCreator
} from "../models/BirdShooterGame";
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
        gameRunning: boolean
        creator: User
    } | null,
    gameActions: {
        newHit(score: number): Promise<Error | undefined>
        startGame(): Promise<void>
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
    const gameRunning = game.gameRunning
    const creator = getCreator(game, players)

    // TODO better streamline throwing errors. This is the only short way I found, that typescript accepts
    if(currentPlayer instanceof Error ||
        winner instanceof Error ||
        hitsPerPlayer instanceof Error ||
        creator instanceof Error
    ){
        const error = findFirstError(currentPlayer, winner, hitsPerPlayer, creator)
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
        gameRunning: gameRunning,
        creator: creator,
    }

    // Define Game actions
    const startGame = () => {
        const docRef = doc(db.gameBirdShooter, game.id)
        return setDoc(docRef, {
            gameRunning: true,
        }, {merge: true})
    }

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
        await setDoc(docRef, {
            hits: newHits,
        }, {merge: true})
    }


    const gameActions = {
        newHit: newHit,
        startGame: startGame,
    }


    return {
        loading: false,
        error: null,
        gameState: gameState,
        gameActions: gameActions,
    }
}

export default usePlayBirdShooterGame
