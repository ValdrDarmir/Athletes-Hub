import React from 'react';

interface Props {
    error: Error | false | null | undefined
}

function ErrorDisplay({error}: Props) {
    // this should not be needed, but typescript complains otherwise
    const unknownError = new Error("Unknown error happened")

    const finalError = error || unknownError

    return (
        <div className="w-full flex flex-col items-center text-error">
            <p className="text-8xl mb-2">⚠️</p>
            <p>Oops. Something went wrong...</p>
            <i>{finalError.message}</i>
        </div>
    );
}

export default ErrorDisplay;
