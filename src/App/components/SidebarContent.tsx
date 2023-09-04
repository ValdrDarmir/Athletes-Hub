import React from 'react';
import logo from "../assets/logo.png";
import {Link} from "react-router-dom";
import UserModel from "../../User/models/User.model";

interface Props {
    user: UserModel | undefined;

    toggleSidebar(): void;
}

const sidebarLinksAuthenticated = [
    {route: "/", label: "🏡 Home"},
    {route: "/game", label: "🎯 Neue Challenge"},
    {route: "/games", label: "🏆 Meine Challenges"},
    {route: "/stats", label: "📈 Statistiken"},
    {route: "/profile", label: "👤 Mein Profil"},
]

const sidebarLinksUnAuthenticated = [
    {route: "/login", label: "🔑 Login"},
    {route: "/register", label: "📝 Registrieren"},
]

function SidebarContent({user, toggleSidebar}: Props) {
    return (
        <div className="menu p-2 w-80 h-full bg-base-200 menu-lg">
            <img src={logo} alt="Logo" className="w-1/2 self-center mb-2"/>
            <ul>
                {user ?
                    sidebarLinksAuthenticated.map(({route, label}, i) =>
                        <li key={i}>
                            <Link to={route} onClick={toggleSidebar} className="bg-base-300 mb-2">
                                {label}
                            </Link>
                        </li>
                    ) :
                    sidebarLinksUnAuthenticated.map(({route, label}, i) =>
                        <li key={i}><Link to={route} onClick={toggleSidebar}>{label}</Link></li>
                    )
                }

            </ul>
        </div>
    );
}

export default SidebarContent;
