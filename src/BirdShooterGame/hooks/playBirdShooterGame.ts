import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import {arrayRemove, arrayUnion, doc, query, runTransaction, setDoc} from "firebase/firestore";
import UserModel from "../../User/models/User.model";
import db from "../../shared/utils/db";
import {
    BirdShooterGameStates,
    getHighestScoreParticipantId,
    getState, getTimeUpTimeMillis, getTurnInTimeMillis,
    ParticipantSeriesModel
} from "../models/BirdShooterGame.model";
import Disciplines from "../../User/models/Disciplines";
import separateErrors from "../../shared/utils/separateErrors";
import whereTyped from "../../shared/utils/whereTyped";
import useTimeNowSeconds from "../../shared/hooks/timeNowSeconds";
import {firestore} from "../../shared/utils/firebase";

export interface ParticipantSeriesJoined extends Omit<ParticipantSeriesModel, "userId"> {
    user: UserModel
}

export enum AdditionalHookStates {
    Loading = "loading",
    Error = "error"
}

export interface LoadingStateHook {
    state: AdditionalHookStates.Loading
    data: null
    actions: null
}

export interface ErrorStateHook {
    state: AdditionalHookStates.Error
    data: Error | false | undefined // false/undefined means we missed an error
    actions: null
}

export interface BeforeGameStateHook {
    state: BirdShooterGameStates.BeforeGame
    data: {
        creator: UserModel
        seriesCount: number
        participantSeries: ParticipantSeriesJoined[]
        discipline: Disciplines
    }
    actions: {
        startGame(): Promise<Error | void>
    }
}

export interface PreGameCountDownStateHook {
    state: BirdShooterGameStates.PreGameCountDown
    data: {
        creator: UserModel
        seriesCount: number
        discipline: Disciplines
        participantSeries: ParticipantSeriesJoined[]
        startTimeCountdownSeconds: number
    }
    actions: null
}

export interface TimeRunningStateHook {
    state: BirdShooterGameStates.TimeRunning
    data: {
        creator: UserModel
        seriesCount: number
        discipline: Disciplines
        participantSeries: ParticipantSeriesJoined[]
        timeUpCountdownSeconds: number
    }
    actions: {
        newHit(userId: string, score: number): Promise<Error | void>
    }
}

export interface TurnInStateHook {
    state: BirdShooterGameStates.TurnIn
    data: {
        creator: UserModel
        seriesCount: number
        discipline: Disciplines
        participantSeries: ParticipantSeriesJoined[]
        turnInCountdownSeconds: number
    }
    actions: {
        newHit(userId: string, score: number): Promise<Error | void>
    }
}

export interface AfterGameStateHook {
    state: BirdShooterGameStates.AfterGame
    data: {
        creator: UserModel
        seriesCount: number
        discipline: Disciplines
        participantSeries: ParticipantSeriesJoined[]
        winner: UserModel
    }
    actions: null
}

type AllGameStatesHook =
    LoadingStateHook
    | ErrorStateHook
    | BeforeGameStateHook
    | PreGameCountDownStateHook
    | TimeRunningStateHook
    | TurnInStateHook
    | AfterGameStateHook

function usePlayBirdShooterGame(gameId: string | undefined): AllGameStatesHook {
    const [game, gameLoading, gameError] = useDocumentData(gameId ? doc(db.gameBirdShooter, gameId) : null)

    const participantIds = game && game.participantSeries
        .map(ps => ps.participant.userId)
        .concat("") // to prevent an empty array (firebase doesn't allow that)

    const [participants, participantsLoading, participantsError] = useCollectionData(game &&
        query(db.users, whereTyped<UserModel>("id", "in", participantIds))
    )

    const [creator, creatorsLoading, creatorsError] = useDocumentData(game && doc(db.users, game.creatorId))

    const timeNowSeconds = useTimeNowSeconds();

    // Initial loading
    const loading = gameLoading || participantsLoading || creatorsLoading
    if (loading) {
        return {state: AdditionalHookStates.Loading, data: null, actions: null}
    }

    // Initial Errors
    if (!gameId || !game || !participants || !creator) {
        const noGameIdError = !gameId && new Error("No game id was given.")
        const noGameError = !game && new Error("No game found")
        const noPlayersError = !participants && new Error("No players found")
        const noCreatorError = !creator && new Error("Creator not found");

        const error = gameError || participantsError || creatorsError || noGameIdError || noGameError || noPlayersError || noCreatorError

        return {state: AdditionalHookStates.Error, data: error, actions: null}
    }

    // Join data
    const [joinedParticipantSeries, joinErrors] = separateErrors(game.participantSeries.map(participantSeries => {
            const user = participants.find(user => user.id === participantSeries.participant.userId)
            if (!user) {
                return new Error(`User ${participantSeries.participant.userId} not found`)
            }

            return {
                ...participantSeries,
                user: user,
            }
        }
    ))

    const sortedParticipantSeries = joinedParticipantSeries.sort((a, b) => {
        const aId = a.participant.userId
        const bId = b.participant.userId
        return aId < bId ? -1 : 1;
    })

    if (joinErrors.length > 0) {
        return {state: AdditionalHookStates.Error, data: joinErrors[0], actions: null}
    }

    const newHit = async (userId: string, score: number) => {
        const oldParticipantSeries = game.participantSeries.find(ps => ps.participant.userId === userId)

        if (!oldParticipantSeries) {
            return new Error("No participant series found")
        }

        const newParticipantSeries: ParticipantSeriesModel = {
            ...oldParticipantSeries,
            series: [...oldParticipantSeries.series, score],
        }

        // update participant series
        const docRef = doc(db.gameBirdShooter, game.id)

        await runTransaction(firestore, async (transaction) => {
            transaction.set(docRef, {
                participantSeries: arrayRemove(oldParticipantSeries),
            }, {merge: true})

            transaction.set(docRef, {
                participantSeries: arrayUnion(newParticipantSeries),
            }, {merge: true})
        })
    }

    // Determine game state in logical order and handle errors
    switch (getState(game)) {
        case BirdShooterGameStates.BeforeGame:
            return {
                state: BirdShooterGameStates.BeforeGame,
                data: {
                    creator: creator,
                    seriesCount: game.seriesCount,
                    discipline: game.discipline,
                    participantSeries: sortedParticipantSeries,
                },
                actions: {
                    async startGame() {
                        if (participants.length === 0) {
                            return new Error("No players in game")
                        }
                        // Start in 30 Seconds
                        const nowMillis = (new Date()).getTime()
                        const startTimeMillis = nowMillis + (30 * 1000)

                        const docRef = doc(db.gameBirdShooter, game.id)
                        await setDoc(docRef, {
                            startTimeMillis: startTimeMillis,
                        }, {merge: true})
                    }
                }
            }

        case BirdShooterGameStates.PreGameCountDown:
            if (!game.startTimeMillis) {
                return {state: AdditionalHookStates.Error, data: new Error("No start time set"), actions: null}
            }

            const startTimeCountdownSeconds = Math.floor((game.startTimeMillis / 1000)) - timeNowSeconds


            return {
                state: BirdShooterGameStates.PreGameCountDown,
                data: {
                    creator: creator,
                    seriesCount: game.seriesCount,
                    discipline: game.discipline,
                    participantSeries: sortedParticipantSeries,
                    startTimeCountdownSeconds: startTimeCountdownSeconds,
                },
                actions: null
            }

        case BirdShooterGameStates.TimeRunning:
            const timeUpTimeMillis = getTimeUpTimeMillis(game)
            if (!timeUpTimeMillis) {
                return {state: AdditionalHookStates.Error, data: new Error("No time up time set"), actions: null}
            }

            const timeUpCountdownSeconds = Math.floor((timeUpTimeMillis / 1000)) - timeNowSeconds

            return {
                state: BirdShooterGameStates.TimeRunning,
                data: {
                    creator: creator,
                    seriesCount: game.seriesCount,
                    discipline: game.discipline,
                    participantSeries: sortedParticipantSeries,
                    timeUpCountdownSeconds: timeUpCountdownSeconds,
                },
                actions: {
                    newHit: newHit,
                }
            }

        case BirdShooterGameStates.TurnIn:
            const turnInTimeMillis = getTurnInTimeMillis(game)
            if (!turnInTimeMillis) {
                return {state: AdditionalHookStates.Error, data: new Error("No turn in time set"), actions: null}
            }

            const turnInCountdownSeconds = Math.floor((turnInTimeMillis / 1000)) - timeNowSeconds


            return {
                state: BirdShooterGameStates.TurnIn,
                data: {
                    creator: creator,
                    seriesCount: game.seriesCount,
                    discipline: game.discipline,
                    participantSeries: sortedParticipantSeries,
                    turnInCountdownSeconds: turnInCountdownSeconds,
                },
                actions: {
                    newHit: newHit,
                }
            }

        case BirdShooterGameStates.AfterGame:
            const joinedWinner = participants.find(user => user.id === getHighestScoreParticipantId(game))
            if (!joinedWinner) {
                return {state: AdditionalHookStates.Error, data: new Error("No winner found"), actions: null}
            }

            return {
                state: BirdShooterGameStates.AfterGame,
                data: {
                    creator: creator,
                    seriesCount: game.seriesCount,
                    discipline: game.discipline,
                    participantSeries: sortedParticipantSeries,
                    winner: joinedWinner
                },
                actions: null
            }
    }

}

export default usePlayBirdShooterGame
