function separateErrors<T>(arr: (T | Error)[]): [T[], Error[]] {
    const errors = arr.filter((item): item is Error => item instanceof Error)
    const values = arr.filter((item): item is T => !(item instanceof Error))

    return [values, errors]
}

export default separateErrors
