import React from 'react';
import User from "../../models/User";
import SidebarAndContent from "../SidebarAndContent/SidebarAndContent";

interface Props {
    user: User | undefined
    children: React.ReactNode
}

function Layout({user, children}: Props) {

    return (
        <div>
            <SidebarAndContent user={user}>
                {children}
            </SidebarAndContent>
        </div>
    );
}

export default Layout;
