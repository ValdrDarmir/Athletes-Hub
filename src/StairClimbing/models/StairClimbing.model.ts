import BaseDBModel from "../../shared/models/BaseDB.model";
import {StepGoal} from "./StepGoals";
import JoinReplace from "../../shared/models/JoinReplace";
import UserModel from "../../User/models/User.model";
import Disciplines from "../../User/models/Disciplines";

export type JoinedPlayerStepModel = JoinReplace<PlayerStepModel, "userId", UserModel>

export interface PlayerStepModel {
    userId: string
    stepIndex: number
}

export default interface StairClimbingModel extends BaseDBModel {
    stepGoals: StepGoal[]                        // set at creation
    shootingTimeLimitMillis: number              // set at creation
    creatorId: string                            // set at creation
    discipline: Disciplines                      // set at creation
    playerIds: string[]                          // filled, before game starts
    startTimeMillis: number | null               // set, when the creator starts the game
    playerSteps: PlayerStepModel[]               // created before game starts, updated during game
}

export enum StairClimbingStates {
    BeforeStart = "BeforeStart",
    PreStartCountDown = "PreStartCountDown",
    Running = "Running",
    Finished = "Finished",
}

export function getTimeBeforeStartSeconds(game: StairClimbingModel, nowMillis: number) {
    if (!game.startTimeMillis) {
        return null
    }

    return (game.startTimeMillis - nowMillis) / 1000
}

export function getTimeBeforeFinishSeconds(game: StairClimbingModel, nowMillis: number) {
    if (!game.startTimeMillis) {
        return null
    }
    const endTimeMillis = game.startTimeMillis + game.shootingTimeLimitMillis

    return (endTimeMillis - nowMillis) / 1000
}

export function getState(game: StairClimbingModel, nowMillis: number) {
    if (!game.startTimeMillis) {
        return StairClimbingStates.BeforeStart
    }

    const isTimeBeforeStart = getTimeBeforeStartSeconds(game, nowMillis)! > 0
    const isTimeBeforeFinish = getTimeBeforeFinishSeconds(game, nowMillis)! > 0
    const participantFinished = game.playerSteps.some(participantStep => participantStep.stepIndex >= game.stepGoals.length)

    if (isTimeBeforeStart) {
        return StairClimbingStates.PreStartCountDown
    }

    if (isTimeBeforeFinish && !participantFinished) {
        return StairClimbingStates.Running
    }

    return StairClimbingStates.Finished
}

export function sortAfterRanking(a: { stepIndex: number }, b: { stepIndex: number }) {
    return a.stepIndex > b.stepIndex ? -1 : 1
}

export function findPlayerStepForUserId(game: StairClimbingModel, userId: string) {
    return game.playerSteps.find(playerStep => playerStep.userId === userId)
}

export function getCurrentStepGoalInfosForPlayer(game: StairClimbingModel, player: PlayerStepModel) {
    return game.stepGoals[player.stepIndex]
}

