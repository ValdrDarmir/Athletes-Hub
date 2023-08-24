import React from 'react';

interface Props {
    children: React.ReactNode
}

function Layout({children}: Props) {
    return (
        <div>{children}</div>
    );
}

export default Layout;
