import React from 'react';
import {Link} from "react-router-dom";
import User from "../../models/User";

interface Props {
    user: User | undefined
    children: React.ReactNode
}

const sidebarLinksAuthenticated = [
    {route: "/", label: "🏡 Home"},
    {route: "/game", label: "🎯 Neue Challenge"},
    {route: "/games", label: "🏆 Meine Challenges"},
    {route: "/stats", label: "📈 Statistiken"},
    {route: "#", label: "👤 Mein Profil (TODO)"},
]

const sidebarLinksUnAuthenticated = [
    {route: "/login", label: "🔑 Login"},
    {route: "/register", label: "📝 Registrieren"},
]

function SidebarAndContent({user, children}: Props) {
    const [open, setOpen] = React.useState(false)

    const toggleDrawer = () => {
        setOpen(!open)
    }

    return (
        <div className="drawer drawer-end">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" checked={open} onChange={toggleDrawer}/>
            <div className="drawer-content">
                <div className="absolute right-0">
                    <label htmlFor="my-drawer" className="btn btn-sm btn-circle btn-ghost m-1">
                        <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                             viewBox="0 0 512 512">
                            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/>
                        </svg>
                    </label>
                </div>
                {/*content here*/}
                {children}
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <ul className="menu p-2 w-80 h-full bg-base-200 text-lg">
                    {/* Sidebar items content here */}
                    {user ?
                        sidebarLinksAuthenticated.map(({route, label}, i) =>
                            <li key={i}>
                                <Link to={route} onClick={toggleDrawer} className="bg-base-300 mb-2">
                                    {label}
                                </Link>
                            </li>
                        ) :
                        sidebarLinksUnAuthenticated.map(({route, label}, i) =>
                            <li key={i}><Link to={route} onClick={toggleDrawer}>{label}</Link></li>
                        )
                    }

                </ul>
            </div>
        </div>
    );
}

export default SidebarAndContent;
