import React from "react";

/**
 * Use this meta hook to debounce the result of another hook.
 * We use this for useCollectionData hooks, that load data, that is supposed to be joined with other data, because they can load incomplete data initially.
 *
 * Example:
 * ```
 * const [users, usersLoading, usersError] = useCollectionData(db.users)
 * const [games, gamesLoading, gamesError] = useDebounceHook(useCollectionData(query(db.gameBirdShooter, where("userId", "==", userId))))
 * // ^ this hook is debounced, because it loads incomplete data initially, which would lead to an error, when joined with the users data
 * ```
 * @param hookResult
 * @param delayMs
 */
function useDebounceHook<T>(hookResult: T, delayMs: number = 300): T {
    const [delayedHook, setDelayedHook] = React.useState<T>(hookResult)
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>()

    React.useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
            setDelayedHook(hookResult)
        }, delayMs)

        return () => clearTimeout(timeoutRef.current)
    }, [delayMs, hookResult])

    return delayedHook
}

export default useDebounceHook
