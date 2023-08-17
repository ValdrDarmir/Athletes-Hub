function nonFalsy<T>(val: T | undefined | null): val is T {
    return Boolean(val)
}

export default nonFalsy
