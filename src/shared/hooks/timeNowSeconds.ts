import {useEffect, useState} from "react";

/**
 * This is the current time in seconds as a hook. This way components that use the time are updated correctly.
 */
function useTimeNowSeconds() {
    const [timeNowSeconds, setTimeNowSeconds] = useState(Math.floor(Date.now() / 1000));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeNowSeconds(Math.floor(Date.now() / 1000));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return timeNowSeconds;
}

export default useTimeNowSeconds
