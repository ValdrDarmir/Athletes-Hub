import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import {arrayRemove, arrayUnion, doc, query, runTransaction, setDoc} from "firebase/firestore";
import UserModel from "../../User/models/User.model";
import db from "../../shared/utils/db";
import separateErrors from "../../shared/utils/separateErrors";
import whereTyped from "../../shared/utils/whereTyped";
import useTimeNowSeconds from "../../shared/hooks/timeNowSeconds";
import {firestore} from "../../shared/utils/firebase";
import useDebounceHook from "../../shared/hooks/debounceHook";
import {
    findPlayerStepForUserId, getCurrentStepGoalInfosForPlayer,
    getState, getTimeBeforeFinishSeconds,
    getTimeBeforeStartSeconds, JoinedPlayerStepModel,
    PlayerStepModel, sortAfterRanking,
    StairClimbingStates
} from "../models/StairClimbing.model";
import {StepGoalInfo, StepGoals} from "../models/StepGoals";

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
    state: StairClimbingStates.BeforeStart
    data: {
        id: string
        creator: UserModel
        stepGoals: StepGoals[]
        playerSteps: JoinedPlayerStepModel[]
    }
    actions: {
        startGame(): Promise<Error | void>
    }
}

export interface PreStartCountDownStateHook {
    state: StairClimbingStates.PreStartCountDown
    data: {
        id: string
        creator: UserModel
        stepGoals: StepGoals[]
        playerSteps: JoinedPlayerStepModel[]
        timeBeforeStartSeconds: number
    }
    actions: null
}

export interface RunningStateHook {
    state: StairClimbingStates.Running
    data: {
        id: string
        creator: UserModel
        stepGoals: StepGoals[]
        playerSteps: JoinedPlayerStepModel[]
        currentStepGoalInfo: StepGoalInfo,
        timeBeforeFinishSeconds: number
    }
    actions: {
        climbStep(userId: string): Promise<Error | void>
    }
}

export interface FinishedStateHook {
    state: StairClimbingStates.Finished
    data: {
        id: string
        creator: UserModel
        stepGoals: StepGoals[]
        playerSteps: JoinedPlayerStepModel[]
        winner: JoinedPlayerStepModel
    }
    actions: null
}

export type AllStairClimbingStatesHook =
    LoadingStateHook
    | ErrorStateHook
    | BeforeStartStateHook
    | PreStartCountDownStateHook
    | RunningStateHook
    | FinishedStateHook

function usePlayStairClimbing(gameId: string | undefined, user: UserModel): AllStairClimbingStatesHook {
    const [game, gameLoading, gameError] = useDocumentData(gameId ? doc(db.stairClimbing, gameId) : null)

    const participantIds = game && game.playerIds
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
    if (!gameId || !game || !participants || !creator) {
        const noGameIdError = !gameId && new Error("No game id was given.")
        const noGameError = !game && new Error("No game found")
        const noPlayersError = !participants && new Error("No players found")
        const noCreatorError = !creator && new Error("Creator not found");

        const error = gameError || participantsError || creatorsError || noGameIdError || noGameError || noPlayersError || noCreatorError

        return {state: AdditionalHookStates.Error, data: error, actions: null}
    }

    // Join data
    const [joinedPlayerSteps, joinErrors] = separateErrors(game.playerSteps.map(playerSteps => {
            const user = participants.find(user => user.id === playerSteps.userId)
            if (!user) {
                return new Error(`User ${playerSteps.userId} not found`)
            }

            return {
                ...playerSteps,
                user: user
            } as JoinedPlayerStepModel
        }
    ))

    const sortedPlayerSteps = joinedPlayerSteps.sort(sortAfterRanking)

    if (joinErrors.length > 0) {
        return {state: AdditionalHookStates.Error, data: joinErrors[0], actions: null}
    }

    const climbStep = async (userId: string) => {
        const oldParticipantSeries = game.playerSteps.find(ps => ps.userId === userId)

        if (!oldParticipantSeries) {
            return new Error("No participant series found")
        }

        const newParticipantSeries: PlayerStepModel = {
            ...oldParticipantSeries,
            stepIndex: oldParticipantSeries.stepIndex + 1,
        }

        // update participant steps
        const docRef = doc(db.stairClimbing, game.id)

        await runTransaction(firestore, async (transaction) => {
            transaction.set(docRef, {
                playerSteps: arrayRemove(oldParticipantSeries),
            }, {merge: true})

            transaction.set(docRef, {
                playerSteps: arrayUnion(newParticipantSeries),
            }, {merge: true})
        })
    }

    // Determine game state in logical order and handle errors
    switch (getState(game, timeNowSeconds * 1000)) {
        case StairClimbingStates.BeforeStart:
            return {
                state: StairClimbingStates.BeforeStart,
                data: {
                    id: game.id,
                    creator: creator,
                    stepGoals: game.stepGoals,
                    playerSteps: sortedPlayerSteps,
                },
                actions: {
                    async startGame() {
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

        case StairClimbingStates.PreStartCountDown:
            if (!game.startTimeMillis) {
                return {state: AdditionalHookStates.Error, data: new Error("No start time set"), actions: null}
            }

            const timeBeforeStartSeconds = getTimeBeforeStartSeconds(game, timeNowSeconds * 1000)!

            return {
                state: StairClimbingStates.PreStartCountDown,
                data: {
                    id: game.id,
                    creator: creator,
                    stepGoals: game.stepGoals,
                    playerSteps: sortedPlayerSteps,
                    timeBeforeStartSeconds: timeBeforeStartSeconds,
                },
                actions: null
            }

        case StairClimbingStates.Running:
            if (!game.startTimeMillis) {
                return {state: AdditionalHookStates.Error, data: new Error("No time up time set"), actions: null}
            }

            const timeBeforeFinishSeconds = getTimeBeforeFinishSeconds(game, timeNowSeconds * 1000)!

            const currentPlayer = findPlayerStepForUserId(game, user.id)
            if(!currentPlayer) {
                return {state: AdditionalHookStates.Error, data: new Error("User not found in game"), actions: null}
            }

            const currentStepGoalInfo = getCurrentStepGoalInfosForPlayer(game, currentPlayer)

            return {
                state: StairClimbingStates.Running,
                data: {
                    id: game.id,
                    creator: creator,
                    stepGoals: game.stepGoals,
                    playerSteps: sortedPlayerSteps,
                    currentStepGoalInfo: currentStepGoalInfo,
                    timeBeforeFinishSeconds: timeBeforeFinishSeconds,
                },
                actions: {
                    climbStep: climbStep,
                }
            }


        case StairClimbingStates.Finished:
            return {
                state: StairClimbingStates.Finished,
                data: {
                    id: game.id,
                    creator: creator,
                    stepGoals: game.stepGoals,
                    playerSteps: sortedPlayerSteps,
                    winner: sortedPlayerSteps[0],
                },
                actions: null
            }
    }

}

export default usePlayStairClimbing
