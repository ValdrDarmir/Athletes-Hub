import React from 'react';
import {Link} from "react-router-dom";
import UserModel from "../../User/models/User.model";
import {query} from "firebase/firestore";
import {useCollectionData} from "react-firebase-hooks/firestore";
import db from "../../shared/utils/db";
import whereTyped from "../../shared/utils/whereTyped";
import ClubDisciplineModel from "../../User/models/ClubDiscipline.model";
import {routes} from "../../routes";
import logo from "../assets/logo.png";
import Icon from "../../shared/components/Icon";

interface Props {
    user: UserModel
}

function App({user}: Props) {
    const [clubDisciplines, clubDisciplinesLoading,] = useCollectionData(query(db.clubDisciplines, whereTyped<ClubDisciplineModel>("userId", "==", user.id)))

    const userHasNoDisciplines = !clubDisciplinesLoading &&
        (clubDisciplines !== undefined) &&
        (clubDisciplines.length === 0)

    return (
        <div className="flex flex-col items-stretch p-2">
            <img src={logo} className="w-1/2 self-center" alt="Logo"/>

            <h1 className="self-center text-3xl text-primary mb-5 mt-5 uppercase text-center">Hallo {user.displayName}</h1>

            <ul className="menu [&_li>*]:rounded-none divide-y m-4 text-md uppercase">
                <li><Link to={routes.games.path} className="border-t p-6"><Icon code={"view_list"}/> Wettbewerbe &
                    Spiele</Link></li>
                <li><Link to={routes.createStairClimbing.path} className="p-6"><Icon code={"add_circle"}/> Neues
                    Schiessspiel</Link></li>
                <li><Link to={routes.createCompetition.path} className="p-6"><Icon code={"add_circle"}/> Neuer
                    Wettbewerb</Link></li>
                <li><Link to={routes.training.path} className="p-6"><Icon code={"book"}/> Trainingsdoku</Link></li>
                <li><Link to={routes.stats.path} className="p-6"><Icon code={"barChart"}/> Statistiken</Link></li>

                <li
                    className={`flex flex-col items-stretch ${userHasNoDisciplines && "tooltip tooltip-open tooltip-info tooltip-top"}`}
                    data-tip="Trage deinen Verein und Disziplin ein">
                    <Link to={routes.profile.path} className="border-b p-6"><Icon code={"person"}/> Mein Profil</Link>
                </li>
            </ul>

        </div>
    );
}

export default App;
