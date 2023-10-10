import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import {arrayRemove, arrayUnion, doc, query, runTransaction, setDoc} from "firebase/firestore";
import UserModel from "../../User/models/User.model";
import db from "../../shared/utils/db";
import {
    CompetitionStates,
    getHighestScoreParticipantId,
    getState, getTimeUpTimeMillis, getTurnInTimeMillis, JoinedParticipantSeriesModel,
    ParticipantSeriesModel
} from "../models/Competition.model";
import Disciplines from "../../User/models/Disciplines";
import separateErrors from "../../shared/utils/separateErrors";
import whereTyped from "../../shared/utils/whereTyped";
import useTimeNowSeconds from "../../shared/hooks/timeNowSeconds";
import {firestore} from "../../shared/utils/firebase";
import useDebounceHook from "../../shared/hooks/debounceHook";

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

export interface BeforeStartStateHook {
    state: CompetitionStates.BeforeStart
    data: {
        creator: UserModel
        seriesCount: number
        participantSeries: JoinedParticipantSeriesModel[]
        discipline: Disciplines
    }
    actions: {
        startCompetition(): Promise<Error | void>
    }
}

export interface PreStartCountDownStateHook {
    state: CompetitionStates.PreStartCountDown
    data: {
        creator: UserModel
        seriesCount: number
        discipline: Disciplines
        participantSeries: JoinedParticipantSeriesModel[]
        startTimeCountdownSeconds: number
    }
    actions: null
}

export interface TimeRunningStateHook {
    state: CompetitionStates.TimeRunning
    data: {
        creator: UserModel
        seriesCount: number
        discipline: Disciplines
        participantSeries: JoinedParticipantSeriesModel[]
        timeUpCountdownSeconds: number
    }
    actions: {
        newSeries(userId: string, score: number): Promise<Error | void>
    }
}

export interface TurnInStateHook {
    state: CompetitionStates.TurnIn
    data: {
        creator: UserModel
        seriesCount: number
        discipline: Disciplines
        participantSeries: JoinedParticipantSeriesModel[]
        turnInCountdownSeconds: number
    }
    actions: {
        newSeries(userId: string, score: number): Promise<Error | void>
    }
}

export interface AfterCompetitionStateHook {
    state: CompetitionStates.AfterCompetition
    data: {
        creator: UserModel
        seriesCount: number
        discipline: Disciplines
        participantSeries: JoinedParticipantSeriesModel[]
        winner: UserModel
    }
    actions: null
}

type AllCompetitionStatesHook =
    LoadingStateHook
    | ErrorStateHook
    | BeforeStartStateHook
    | PreStartCountDownStateHook
    | TimeRunningStateHook
    | TurnInStateHook
    | AfterCompetitionStateHook

function usePlayCompetition(competitionId: string | undefined): AllCompetitionStatesHook {
    const [game, gameLoading, gameError] = useDocumentData(competitionId ? doc(db.competition, competitionId) : null)

    const participantIds = game && game.participantIds
        .concat("") // to prevent an empty array (firebase doesn't allow that)

    const [participants, participantsLoading, participantsError] = useDebounceHook(useCollectionData(game &&
        query(db.users, whereTyped<UserModel>("id", "in", participantIds)))
    )

    const [creator, creatorsLoading, creatorsError] = useDocumentData(game && doc(db.users, game.creatorId))

    const timeNowSeconds = useTimeNowSeconds();

    // Initial loading
    const loading = gameLoading || participantsLoading || creatorsLoading
    if (loading) {
        return {state: AdditionalHookStates.Loading, data: null, actions: null}
    }

    // Initial Errors
    if (!competitionId || !game || !participants || !creator) {
        const noGameIdError = !competitionId && new Error("No game id was given.")
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
                participant: {
                    ...participantSeries.participant,
                    user: user
                }
            } as JoinedParticipantSeriesModel
        }
    ))

    const sortedParticipantSeries = joinedParticipantSeries.sort((a, b) => {
        const aId = a.participant.user.id
        const bId = b.participant.user.id
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
        const docRef = doc(db.competition, game.id)

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
        case CompetitionStates.BeforeStart:
            return {
                state: CompetitionStates.BeforeStart,
                data: {
                    creator: creator,
                    seriesCount: game.seriesCount,
                    discipline: game.discipline,
                    participantSeries: sortedParticipantSeries,
                },
                actions: {
                    async startCompetition() {
                        if (participants.length === 0) {
                            return new Error("No players in game")
                        }
                        // Start in 30 Seconds
                        const nowMillis = (new Date()).getTime()
                        const startTimeMillis = nowMillis + (30 * 1000)

                        const docRef = doc(db.competition, game.id)
                        await setDoc(docRef, {
                            startTimeMillis: startTimeMillis,
                        }, {merge: true})
                    }
                }
            }

        case CompetitionStates.PreStartCountDown:
            if (!game.startTimeMillis) {
                return {state: AdditionalHookStates.Error, data: new Error("No start time set"), actions: null}
            }

            const startTimeCountdownSeconds = Math.floor((game.startTimeMillis / 1000)) - timeNowSeconds


            return {
                state: CompetitionStates.PreStartCountDown,
                data: {
                    creator: creator,
                    seriesCount: game.seriesCount,
                    discipline: game.discipline,
                    participantSeries: sortedParticipantSeries,
                    startTimeCountdownSeconds: startTimeCountdownSeconds,
                },
                actions: null
            }

        case CompetitionStates.TimeRunning:
            const timeUpTimeMillis = getTimeUpTimeMillis(game)
            if (!timeUpTimeMillis) {
                return {state: AdditionalHookStates.Error, data: new Error("No time up time set"), actions: null}
            }

            const timeUpCountdownSeconds = Math.floor((timeUpTimeMillis / 1000)) - timeNowSeconds

            return {
                state: CompetitionStates.TimeRunning,
                data: {
                    creator: creator,
                    seriesCount: game.seriesCount,
                    discipline: game.discipline,
                    participantSeries: sortedParticipantSeries,
                    timeUpCountdownSeconds: timeUpCountdownSeconds,
                },
                actions: {
                    newSeries: newHit,
                }
            }

        case CompetitionStates.TurnIn:
            const turnInTimeMillis = getTurnInTimeMillis(game)
            if (!turnInTimeMillis) {
                return {state: AdditionalHookStates.Error, data: new Error("No turn in time set"), actions: null}
            }

            const turnInCountdownSeconds = Math.floor((turnInTimeMillis / 1000)) - timeNowSeconds


            return {
                state: CompetitionStates.TurnIn,
                data: {
                    creator: creator,
                    seriesCount: game.seriesCount,
                    discipline: game.discipline,
                    participantSeries: sortedParticipantSeries,
                    turnInCountdownSeconds: turnInCountdownSeconds,
                },
                actions: {
                    newSeries: newHit,
                }
            }

        case CompetitionStates.AfterCompetition:
            const joinedWinner = participants.find(user => user.id === getHighestScoreParticipantId(game))
            if (!joinedWinner) {
                return {state: AdditionalHookStates.Error, data: new Error("No winner found"), actions: null}
            }

            return {
                state: CompetitionStates.AfterCompetition,
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

export default usePlayCompetition
