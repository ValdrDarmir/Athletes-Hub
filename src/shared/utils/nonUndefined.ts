function nonUndefined<T>(val: T | undefined): val is T {
    return Boolean(val)
}

export default nonUndefined
