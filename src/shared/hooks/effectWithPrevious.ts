import {useEffect, useRef} from "react";

function useEffectWithPrevious<TDeps>(effect: (prevDeps: ReadonlyArray<TDeps>) => void, deps: ReadonlyArray<TDeps>) {
    const prevDepsRef = useRef<ReadonlyArray<TDeps>>(deps);

    useEffect(() => {
        effect(prevDepsRef.current)
        prevDepsRef.current = deps
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [effect, ...deps])

}

export default useEffectWithPrevious
