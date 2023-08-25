import React from 'react';

interface Props {
    error: Error
}

function ErrorDisplay({error}: Props) {
    return (
        <div className="w-full flex flex-col items-center text-error">
            <p className="text-8xl">⚠️</p>
            <p>Oops. Something went wrong...</p>
            <i>{error.message}</i>
        </div>
    );
}

export default ErrorDisplay;
