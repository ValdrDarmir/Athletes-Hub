import {useEffect, useRef} from "react";

/*
 * This hook is used to execute an effect when the dependencies change.
 * The effect will be called with the previous dependencies as argument.
 * This is useful when you want to compare the previous and current dependencies.
 * @param effect The effect to execute. It will be called with the previous dependencies as argument.
 * @param deps The dependencies to watch
 */
function useEffectWithPrevious<TDeps>(effect: (prevDeps: ReadonlyArray<TDeps>) => void, deps: ReadonlyArray<TDeps>) {
    const prevDepsRef = useRef<ReadonlyArray<TDeps>>(deps);

    useEffect(() => {
        effect(prevDepsRef.current)
        prevDepsRef.current = deps
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [effect, ...deps])

}

export default useEffectWithPrevious
