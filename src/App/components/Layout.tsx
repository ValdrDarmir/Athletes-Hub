import React from 'react';
import SidebarWrapper from "./SidebarWrapper";
import UserModel from "../../User/models/User.model";

interface Props {
    user: UserModel | undefined
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
