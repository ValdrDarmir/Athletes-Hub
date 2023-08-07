export interface Hit {
    playerId: string
    score: number
}

interface GameBirdShooter {
    id: string
    rounds: number
    playerIds: string[]
    hits: Hit[]
}

export default GameBirdShooter
