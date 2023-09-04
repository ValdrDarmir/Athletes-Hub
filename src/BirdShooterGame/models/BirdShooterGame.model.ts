import UserModel, {compareUserIds} from "../../User/models/User.model";
import BaseDBModel from "../../shared/models/BaseDB.model";
import Disciplines from "../../User/models/Disciplines";
import Participant from "../../GamesGeneral/models/Participant";

export interface Series {
    playerId: string
    score: number
}

export default interface BirdShooterGameModel extends BaseDBModel {
    rounds: number
    participants: Participant[]
    series: Series[]
    discipline: Disciplines
    creatorId: string
    gameRunning: boolean
}

export interface SeriesPlayer {
    player: UserModel
    series: number[]
    currentScore: number
}

export function getCurrentRound(game: BirdShooterGameModel) {
    return Math.floor(game.series.length / game.participants.length) + 1
}

export function getGameFinished(game: BirdShooterGameModel) {
    return getCurrentRound(game) > game.rounds
}

/**
 * @param game
 * @param players must include all players of this game. Can also include other users.
 */
export function getHitsPerPlayer(game: BirdShooterGameModel, players: UserModel[]): SeriesPlayer[] | Error {
    const attendingPlayers = getAttendingPlayers(game, players)

    if (attendingPlayers instanceof Error) {
        return attendingPlayers
    }

    return attendingPlayers.map(player => {
        const playersHits = game.series
            .filter(hit => hit.playerId === player.id)
            .map(hit => hit.score)

        const currentScore = playersHits.reduce((sum, current) => current + sum, 0)

        return {player: player, series: playersHits, currentScore}
    })
}

export function getHighestScorePlayer(game: BirdShooterGameModel, players: UserModel[]) {
    const hitsPerPlayer = getHitsPerPlayer(game, players)

    if (hitsPerPlayer instanceof Error) {
        return hitsPerPlayer
    }

    return hitsPerPlayer.reduce((prev, curr) => prev.currentScore < curr.currentScore ? curr : prev).player
}

export function getWinner(game: BirdShooterGameModel, players: UserModel[]) {
    return (getCurrentRound(game) > game.rounds) ? getHighestScorePlayer(game, players) : null
}

/**
 * @param game
 * @param players must include all players of this game. Can also include other users.
 */
export function getAttendingPlayers(game: BirdShooterGameModel, players: UserModel[]) {
    const attendingPlayers = players
        .filter(user => game.participants.some(participant => participant.userId === user.id))
        .sort(compareUserIds)

    if (attendingPlayers.length !== game.participants.length) {
        return new Error("Could not resolve all players. Are they all provided in the query?")
    }

    return attendingPlayers
}

export function getCurrentPlayer(game: BirdShooterGameModel, players: UserModel[]) {
    const currentPlayerIndex = game.series.length % game.participants.length
    const attendingPlayers = getAttendingPlayers(game, players)

    if (attendingPlayers instanceof Error) {
        return attendingPlayers
    }

    return attendingPlayers[currentPlayerIndex]
}

export function getCreator(game: BirdShooterGameModel, players: UserModel[]) {
    const creator = players.find(player => player.id === game.creatorId)

    if (!creator) {
        return new Error("Could not find creator. Are all players provided in the query?")
    }

    return creator
}
