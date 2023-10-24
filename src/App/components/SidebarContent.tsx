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
        {route: routes.games.path, label: "Wettbewerbe & Spiele"},
        {route: routes.createStairClimbing.path, label: "Neues Schiessspiel"},
        {route: routes.createCompetition.path, label: "Neuer Wettbewerb"},
        {route: routes.training.path, label: "Trainingsdoku"},
        {route: routes.stats.path, label: "Statistiken"},
        {route: routes.profile.path, label: "Mein Profil"},
    ]

    const sidebarLinksUnAuthenticated = [
        {route: routes.login.path, label: "🔑 Login"},
        {route: routes.register.path, label: "📝 Registrieren"},
    ]

    return (
        <div className="flex flex-col items-center w-80 h-full bg-base-100">
            <img src={logo} alt="Logo" className="w-1/2 self-center mb-2"/>
            <ul className="menu p-0 [&_li>*]:rounded-none divide-y divide-y-reverse text-md uppercase w-full">
                {user ?
                    sidebarLinksAuthenticated.map(({route, label}, i) =>
                        <li key={i} className="first:border-t first:border-b">
                            <Link to={route} onClick={toggleSidebar} className="p-6">
                                {label}
                            </Link>
                        </li>
                    ) :
                    sidebarLinksUnAuthenticated.map(({route, label}, i) =>
                        <li key={i} className="first:border-t first:border-b">
                            <Link to={route} onClick={toggleSidebar} className="p-6">{label}</Link>
                        </li>
                    )
                }

            </ul>
        </div>
    );
}

export default SidebarContent;
