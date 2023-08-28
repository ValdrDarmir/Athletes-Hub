import React from 'react';
import SidebarWrapper from "./SidebarWrapper";
import User from "../../User/models/User";

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
