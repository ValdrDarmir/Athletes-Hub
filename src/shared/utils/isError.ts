function isError<T>(val: T | Error): val is Error {
    return val instanceof Error
}

export default isError
