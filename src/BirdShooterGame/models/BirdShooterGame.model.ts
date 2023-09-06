import BaseDBModel from "../../shared/models/BaseDB.model";
import Disciplines from "../../User/models/Disciplines";
import Participant from "../../GamesGeneral/models/Participant";
import sum from "../../shared/utils/sum";

export interface ParticipantSeriesModel {
    participant: Participant
    series: number[]
}

export default interface BirdShooterGameModel extends BaseDBModel {
    seriesCount: number                       // set at creation
    shootingTimeLimitMillis: number           // set at creation
    discipline: Disciplines                   // set at creation
    creatorId: string                         // set at creation
    participantIds: string[]                  // filled, before game starts
    startTimeMillis: number | null            // set, when the creator starts the game
    participantSeries: ParticipantSeriesModel[]    // created before game starts, updated during game
}

export enum BirdShooterGameStates {
    BeforeGame = "BeforeGame",
    PreGameCountDown = "PreGameCountDown",
    TimeRunning = "TimeRunning",
    TurnIn = "TurnIn",
    AfterGame = "AfterGame",
}

export function getTimeUpTimeMillis(game: BirdShooterGameModel) {
    if (!game.startTimeMillis) {
        return null
    }
    return game.startTimeMillis + game.shootingTimeLimitMillis
}

export function getTurnInTimeMillis(game: BirdShooterGameModel) {
    const timeUpTimeMillis = getTimeUpTimeMillis(game)
    if (!timeUpTimeMillis) {
        return null
    }
    return timeUpTimeMillis + (5 * 60 * 1000)   // 5 minutes after time is up
}

export function getState(game: BirdShooterGameModel) {
    if (!game.startTimeMillis) {
        return BirdShooterGameStates.BeforeGame
    }

    const nowMillis = (new Date()).getTime()
    const startTimeDiffMillis = game.startTimeMillis - nowMillis
    const timeUpTimeDiffMillis = getTimeUpTimeMillis(game)! - nowMillis
    const turnInEndTimeDiffMillis = getTurnInTimeMillis(game)! - nowMillis

    const isTimeBeforeStart = startTimeDiffMillis > 0
    const isTimeBeforeLimit = timeUpTimeDiffMillis > 0
    const isTimeBeforeTurnInEnd = turnInEndTimeDiffMillis > 0

    const participantsFinished = game.participantSeries.every(participantSeries => participantSeries.series.length === game.seriesCount)

    if (isTimeBeforeStart) {
        return BirdShooterGameStates.PreGameCountDown
    }

    if (isTimeBeforeLimit && !participantsFinished) {
        return BirdShooterGameStates.TimeRunning
    }

    if (isTimeBeforeTurnInEnd && !participantsFinished) {
        return BirdShooterGameStates.TurnIn
    }

    return BirdShooterGameStates.AfterGame
}

export function getScoreSum(participantSeries: ParticipantSeriesModel) {
    return sum(...participantSeries.series)
}

export function getHighestScoreParticipantId(game: BirdShooterGameModel) {
    const highestScoreSeries = game.participantSeries
        .reduce((prev, curr) => {
            return getScoreSum(prev) > getScoreSum(curr) ? prev : curr
        })

    return highestScoreSeries.participant.userId
}
