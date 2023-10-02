export function formatSecondsHHMMSS(seconds: number) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds - hours * 3600) / 60)
    const secondsLeft = seconds - hours * 3600 - minutes * 60

    const hoursString = hours.toString().padStart(2, "0")
    const minutesString = minutes.toString().padStart(2, "0")
    const secondsString = secondsLeft.toString().padStart(2, "0")

    return `${hoursString}:${minutesString}:${secondsString}`
}

export function formatSecondsMMSS(seconds: number) {
    const minutes = Math.floor(seconds / 60)
    const secondsLeft = Math.round(seconds - minutes * 60)

    const minutesString = minutes.toString().padStart(2, "0")
    const secondsString = secondsLeft.toString().padStart(2, "0")

    return `${minutesString}:${secondsString}`
}
