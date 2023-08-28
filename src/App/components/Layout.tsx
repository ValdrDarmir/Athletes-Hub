import React from 'react';
import User from "../models/User";
import SidebarWrapper from "./SidebarWrapper";

interface Props {
    user: User | undefined
    children: React.ReactNode
}

function Layout({user, children}: Props) {

    return (
        <div>
            <SidebarWrapper user={user}>
                {children}
            </SidebarWrapper>
        </div>
    );
}

export default Layout;
