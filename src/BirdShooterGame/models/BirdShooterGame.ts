import User, {compareUserIds} from "../../User/models/User";
import BaseDBModel from "../../shared/models/BaseDBModel";

export interface Hit {
    playerId: string
    score: number
}

export default interface BirdShooterGame extends BaseDBModel {
    rounds: number
    playerIds: string[]
    hits: Hit[]
    creatorId: string
    gameRunning: boolean
}

export interface HitsPlayer {
    player: User
    hits: number[]
    currentScore: number
}

export function getCurrentRound(game: BirdShooterGame) {
    return Math.floor(game.hits.length / game.playerIds.length) + 1
}

export function getGameFinished(game: BirdShooterGame) {
    return getCurrentRound(game) > game.rounds
}

/**
 * @param game
 * @param players must include all players of this game. Can also include other users.
 */
export function getHitsPerPlayer(game: BirdShooterGame, players: User[]): HitsPlayer[] | Error {
    const attendingPlayers = getAttendingPlayers(game, players)

    if(attendingPlayers instanceof Error){
        return attendingPlayers
    }

    return attendingPlayers.map(player => {
        const playersHits = game.hits
            .filter(hit => hit.playerId === player.id)
            .map(hit => hit.score)

        const currentScore = playersHits.reduce((sum, current) => current + sum, 0)

        return {player: player, hits: playersHits, currentScore}
    })
}

export function getHighestScorePlayer(game: BirdShooterGame, players: User[]) {
    const hitsPerPlayer = getHitsPerPlayer(game, players)

    if(hitsPerPlayer instanceof Error){
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
        .filter(user => game.playerIds.includes(user.id))
        .sort(compareUserIds)

    if(attendingPlayers.length !== game.playerIds.length){
        return new Error("Could not resolve all players. Are they all provided in the query?")
    }

    return attendingPlayers
}

export function getCurrentPlayer(game: BirdShooterGame, players: User[]) {
    const currentPlayerIndex = game.hits.length % game.playerIds.length
    const attendingPlayers = getAttendingPlayers(game, players)

    if(attendingPlayers instanceof Error){
        return attendingPlayers
    }

    return attendingPlayers[currentPlayerIndex]
}

export function getCreator(game: BirdShooterGame, players: User[]) {
    const creator = players.find(player => player.id === game.creatorId)

    if(!creator){
        return new Error("Could not find creator. Are all players provided in the query?")
    }

    return creator
}
