enum Games {
    None, StairClimbing,
}

export const gameNames = {
    [Games.None]: "None",
    [Games.StairClimbing]: "Treppensteigen",
} as const

export default Games
