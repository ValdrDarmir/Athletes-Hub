function isNumber<T>(val: T | Number): val is number {
    return typeof val === "number"
}

export default isNumber
