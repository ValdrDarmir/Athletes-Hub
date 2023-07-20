interface Hit {
    playerId: string
    points: number
}

interface GameBirdShooter {
    id: string
    rounds: number
    playerIds: string[]
    hits: Hit[]
}

export default GameBirdShooter
