import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import {doc, query, setDoc, where} from "firebase/firestore";
import UserModel from "../../User/models/User.model";
import db from "../../shared/utils/db";
import {
    getCurrentRound, getCurrentPlayer,
    getHitsPerPlayer,
    getWinner,
    SeriesPlayer
} from "../models/BirdShooterGame.model";
import findFirstError from "../../shared/utils/findFirstError";
import Disciplines from "../../User/models/Disciplines";


export enum GameStates {
    Loading, Error, BeforeGame, InGame, AfterGame
}

export interface LoadingState {
    state: GameStates.Loading
    data: null
    actions: null
}

export interface ErrorState {
    state: GameStates.Error
    data: Error | false | undefined // false/undefined means we missed an error
    actions: null
}

export interface BeforeGameState {
    state: GameStates.BeforeGame
    data: {
        players: UserModel[]
        creator: UserModel
        maxRounds: number
        discipline: Disciplines
    }
    actions: {
        startGame(): Promise<Error | void>
    }
}

export interface InGameState {
    state: GameStates.InGame
    data: {
        players: UserModel[]
        creator: UserModel
        maxRounds: number
        discipline: Disciplines
        currentPlayer: UserModel
        currentRound: number
        hitsPerPlayer: SeriesPlayer[]
    }
    actions: {
        newHit(score: number): Promise<Error | void>
    }
}

export interface AfterGameState {
    state: GameStates.AfterGame
    data: {
        players: UserModel[]
        creator: UserModel
        maxRounds: number
        discipline: Disciplines
        hitsPerPlayer: SeriesPlayer[]
        winner: UserModel
    }
    actions: null
}

type AllGameStates = LoadingState | ErrorState | BeforeGameState | InGameState | AfterGameState

function usePlayBirdShooterGame(gameId: string | undefined): AllGameStates {
    const [game, gameLoading, gameError] = useDocumentData(gameId ? doc(db.gameBirdShooter, gameId) : null)

    const allPlayersIds = game && game.participants
        .map(participant => participant.userId)
        .concat("") // to prevent an empty array (firebase doesn't allow that)

    const [players, playersLoading, playersError] = useCollectionData(game &&
        query(db.users, where("id", "in", allPlayersIds))
    )

    const [creator, creatorsLoading, creatorsError] = useDocumentData(game && doc(db.users, game.creatorId))

    // Initial loading
    const loading = gameLoading || playersLoading || creatorsLoading
    if (loading) {
        return {state: GameStates.Loading, data: null, actions: null}
    }

    // Initial Errors
    if (!gameId || !game || !players || !creator) {
        const noGameIdError = !gameId && new Error("No game id was given.")
        const noGameError = !game && new Error("No game found")
        const noPlayersError = !players && new Error("No players found")
        const noCreatorError = !creator && new Error("Creator not found");

        const error = gameError || playersError || creatorsError || noGameIdError || noGameError || noPlayersError || noCreatorError

        return {state: GameStates.Error, data: error, actions: null}
    }

    // Determine game state in logical order and handle errors
    const currentPlayer = getCurrentPlayer(game, players)
    const currentRound = getCurrentRound(game)
    const maxRounds = game.rounds
    const winner = getWinner(game, players)
    const hitsPerPlayer = getHitsPerPlayer(game, players)
    const gameRunning = game.gameRunning

    if (!gameRunning) {
        return {
            state: GameStates.BeforeGame,
            data: {
                players: players,
                creator: creator,
                maxRounds: maxRounds,
                discipline: game.discipline,
            },
            actions: {
                async startGame() {
                    if (players.length === 0) {
                        return new Error("No players in game")
                    }

                    const docRef = doc(db.gameBirdShooter, game.id)
                    await setDoc(docRef, {
                        gameRunning: true,
                    }, {merge: true})
                }
            }

        }
    }

    if (currentPlayer instanceof Error || hitsPerPlayer instanceof Error) {
        const error = findFirstError(currentPlayer, hitsPerPlayer)
        return {state: GameStates.Error, data: error, actions: null}
    }

    if (!winner) {
        return {
            state: GameStates.InGame,
            data: {
                players: players,
                creator: creator,
                maxRounds: maxRounds,
                discipline: game.discipline,
                currentPlayer: currentPlayer,
                currentRound: currentRound,
                hitsPerPlayer: hitsPerPlayer,
            },
            actions: {
                async newHit(score: number) {
                    const currentPlayer = getCurrentPlayer(game, players)

                    if (currentPlayer instanceof Error) {
                        return currentPlayer
                    }

                    const newHit = {
                        playerId: currentPlayer.id,
                        score: score,
                    }

                    const newHits = [...game.series, newHit]

                    const docRef = doc(db.gameBirdShooter, game.id)
                    await setDoc(docRef, {
                        series: newHits,
                    }, {merge: true})
                }
            }
        }
    }

    if (winner instanceof Error) {
        return {state: GameStates.Error, data: winner, actions: null}
    }

    return {
        state: GameStates.AfterGame,
        data: {
            players: players,
            creator: creator,
            maxRounds: maxRounds,
            discipline: game.discipline,
            hitsPerPlayer: hitsPerPlayer,
            winner: winner!,
        },
        actions: null,
    }
}

export default usePlayBirdShooterGame
