import User, {compareUserIds} from "../../User/models/User";
import BaseDBModel from "../../shared/models/BaseDBModel";
import Disciplines from "../../User/models/Disciplines";
import Participant from "../../GamesGeneral/models/Participant";

export interface Series {
    playerId: string
    score: number
}

export default interface BirdShooterGame extends BaseDBModel {
    rounds: number
    participants: Participant[]
    series: Series[]
    discipline: Disciplines
    creatorId: string
    gameRunning: boolean
}

export interface SeriesPlayer {
    player: User
    series: number[]
    currentScore: number
}

export function getCurrentRound(game: BirdShooterGame) {
    return Math.floor(game.series.length / game.participants.length) + 1
}

export function getGameFinished(game: BirdShooterGame) {
    return getCurrentRound(game) > game.rounds
}

/**
 * @param game
 * @param players must include all players of this game. Can also include other users.
 */
export function getHitsPerPlayer(game: BirdShooterGame, players: User[]): SeriesPlayer[] | Error {
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

export function getHighestScorePlayer(game: BirdShooterGame, players: User[]) {
    const hitsPerPlayer = getHitsPerPlayer(game, players)

    if (hitsPerPlayer instanceof Error) {
        return hitsPerPlayer
    }

    return hitsPerPlayer.reduce((prev, curr) => prev.currentScore < curr.currentScore ? curr : prev).player
}

export function getWinner(game: BirdShooterGame, players: User[]) {
    return (getCurrentRound(game) > game.rounds) ? getHighestScorePlayer(game, players) : null
}

/**
 * @param game
 * @param players must include all players of this game. Can also include other users.
 */
export function getAttendingPlayers(game: BirdShooterGame, players: User[]) {
    const attendingPlayers = players
        .filter(user => game.participants.some(participant => participant.userId === user.id))
        .sort(compareUserIds)

    if (attendingPlayers.length !== game.participants.length) {
        return new Error("Could not resolve all players. Are they all provided in the query?")
    }

    return attendingPlayers
}

export function getCurrentPlayer(game: BirdShooterGame, players: User[]) {
    const currentPlayerIndex = game.series.length % game.participants.length
    const attendingPlayers = getAttendingPlayers(game, players)

    if (attendingPlayers instanceof Error) {
        return attendingPlayers
    }

    return attendingPlayers[currentPlayerIndex]
}

export function getCreator(game: BirdShooterGame, players: User[]) {
    const creator = players.find(player => player.id === game.creatorId)

    if (!creator) {
        return new Error("Could not find creator. Are all players provided in the query?")
    }

    return creator
}
