function emptyToNull<T>(arr: T[]) {
    return arr.length === 0 ? null : arr;
}

export default emptyToNull
