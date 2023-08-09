import User, {compareUserIds} from "../../App/models/User";

export interface Hit {
    playerId: string
    score: number
}

export default interface BirdShooterGameModel {
    id: string
    rounds: number
    playerIds: string[]
    hits: Hit[]
}

export interface HitsPlayer {
    player: User
    hits: number[]
    currentScore: number
}

export function getCurrentRound(game: BirdShooterGameModel) {
    return Math.floor(game.hits.length / game.playerIds.length) + 1
}

export function getGameFinished(game: BirdShooterGameModel) {
    return getCurrentRound(game) > game.rounds
}

/**
 * @param game
 * @param players must include all players of this game. Can also include other users.
 */
export function getHitsPerPlayer(game: BirdShooterGameModel, players: User[]): HitsPlayer[] {
    return players.map(player => {
        const playersHits = game.hits
            .filter(hit => hit.playerId === player.id)
            .map(hit => hit.score)

        const currentScore = playersHits.reduce((sum, current) => current + sum, 0)

        return {player: player, hits: playersHits, currentScore}
    })
}

export function getHighestScorePlayer(game: BirdShooterGameModel, players: User[]) {
    const hitsPerPlayer = getHitsPerPlayer(game, players)
    return hitsPerPlayer.reduce((prev, curr) => prev.currentScore < curr.currentScore ? curr : prev).player

}

export function getWinner(game: BirdShooterGameModel, players: User[]) {
    return (getCurrentRound(game) > game.rounds) ? getHighestScorePlayer(game, players) : null
}

/**
 * @param game
 * @param players must include all players of this game. Can also include other users.
 */
export function getAttendingPlayers(game: BirdShooterGameModel, players: User[]) {
    return players
        .filter(user => game.playerIds.includes(user.id))
        .sort(compareUserIds)
}

export function getCurrentPlayer(game: BirdShooterGameModel, players: User[]) {
    const currentPlayerIndex = game.hits.length % game.playerIds.length
    const attendingPlayers = getAttendingPlayers(game, players)
    return attendingPlayers[currentPlayerIndex]
}
