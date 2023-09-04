import React from 'react';
import Header from "./Header";
import SidebarContent from "./SidebarContent";
import UserModel from "../../User/models/User.model";

interface Props {
    user: UserModel | undefined
    children: React.ReactNode
}

function SidebarWrapper({user, children}: Props) {
    const [open, setOpen] = React.useState(false)

    const toggleSidebar = () => {
        setOpen(!open)
    }

    return (
        <div className="drawer drawer-end">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" checked={open} onChange={toggleSidebar}/>
            <div className="drawer-content">
                <Header />
                {children}
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <SidebarContent user={user} toggleSidebar={toggleSidebar}/>
            </div>
        </div>
    );
}

export default SidebarWrapper;
