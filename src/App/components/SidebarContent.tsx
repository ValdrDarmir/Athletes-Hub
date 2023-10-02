import React from 'react';
import logo from "../assets/logo.png";
import {Link} from "react-router-dom";
import UserModel from "../../User/models/User.model";
import {routes} from '../../routes';

interface Props {
    user: UserModel | undefined;

    toggleSidebar(): void;
}

function SidebarContent({user, toggleSidebar}: Props) {

    const sidebarLinksAuthenticated = [
        {route: routes.root.path, label: "🏡 Home"},
        {route: routes.games.path, label: "🎲️ Meine Wettbewerbe und Spiele"},
        {route: routes.createStairClimbing.path, label: "🎯 Neues Spiel"},
        {route: routes.createCompetition.path, label: "🏆 Neuer Wettbewerb"},
        {route: routes.training.path, label: "📖 Trainingsdaten"},
        {route: routes.stats.path, label: "📈 Statistiken"},
        {route: routes.profile.path, label: "👤 Mein Profil"},
    ]

    const sidebarLinksUnAuthenticated = [
        {route: routes.login.path, label: "🔑 Login"},
        {route: routes.register.path, label: "📝 Registrieren"},
    ]

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
