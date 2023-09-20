import BaseDBModel from "../../shared/models/BaseDB.model";
import Participant from "../../ChallengeGeneral/models/Participant";
import {StepGoals} from "./StepGoals";

export interface ParticipantStepModel {
    participant: Participant
    stepIndex: number
}

export default interface StairClimbingModel extends BaseDBModel {
    stepGoals: StepGoals[]                       // set at creation
    shootingTimeLimitMillis: number              // set at creation
    creatorId: string                            // set at creation
    participantIds: string[]                     // filled, before game starts
    startTimeMillis: number | null               // set, when the creator starts the game
    participantSteps: ParticipantStepModel[]     // created before game starts, updated during game
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
    const participantFinished = game.participantSteps.some(participantStep => participantStep.stepIndex === game.stepGoals.length - 1)

    if (isTimeBeforeStart) {
        return StairClimbingStates.PreStartCountDown
    }

    if (isTimeBeforeFinish && !participantFinished) {
        return StairClimbingStates.Running
    }

    return StairClimbingStates.Finished
}

export function sortAfterRanking(a: ParticipantStepModel, b: ParticipantStepModel) {
    return a.stepIndex > b.stepIndex ? -1 : 1
}

