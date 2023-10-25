import React from 'react';

interface Props {
    className?: React.SVGProps<SVGSVGElement>["className"]
}

function X({className}: Props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24"
             stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
    );
}

export default X;