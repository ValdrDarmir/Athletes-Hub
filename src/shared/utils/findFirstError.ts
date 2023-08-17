

export default function findFirstError<T extends unknown []>(...vals: readonly [...T]) {
    return vals.find((o): o is Error => o instanceof Error)
}
