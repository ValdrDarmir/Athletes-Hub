import React from 'react';
import {useSignOut} from "react-firebase-hooks/auth";
import {Link} from "react-router-dom";
import {auth} from '../../shared/utils/firebase';
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import UserModel from "../../User/models/User.model";
import {query} from "firebase/firestore";
import {useCollectionData} from "react-firebase-hooks/firestore";
import db from "../../shared/utils/db";
import whereTyped from "../../shared/utils/whereTyped";
import ClubDisciplineModel from "../../User/models/ClubDiscipline.model";
import {ROUTES} from "../../index";

interface Props {
    user: UserModel
}

function App({user}: Props) {
    const [signOut, signOutLoading, signOutError] = useSignOut(auth);
    const [clubDisciplines, clubDisciplinesLoading,] = useCollectionData(query(db.clubDisciplines, whereTyped<ClubDisciplineModel>("userId", "==", user.id)))

    const userHasNoDisciplines = !clubDisciplinesLoading &&
        (clubDisciplines !== undefined) &&
        (clubDisciplines.length === 0)

    return (
        <div className="flex flex-col items-stretch p-2">
            <h1 className="self-center text-2xl mb-2">Hallo {user.displayName}</h1>

            <Link to={ROUTES.games.path} className="btn mb-2">Meine Spiele und Wettbewerbe</Link>
            <Link to={ROUTES.createStairClimbing.path} className="btn mb-2">Neues Spiel starten</Link>
            <Link to={ROUTES.createCompetition.path} className="btn mb-2">Neuen Wettbewerb starten</Link>
            <Link to={ROUTES.training.path} className="btn mb-2">Trainingsdaten</Link>
            <Link to={ROUTES.stats.path} className="btn mb-2">Statistiken</Link>

            <div className="divider"></div>

            <div className={`${userHasNoDisciplines && "tooltip tooltip-open tooltip-info"}`}
                 data-tip="Trage deinen Verein und Disziplin ein">
                <Link to={ROUTES.profile.path} className="btn mb-2">Profil bearbeiten</Link>
            </div>
            <button className="btn btn-outline mb-2" onClick={signOut} disabled={signOutLoading}>Logout</button>
            {signOutError && <ErrorDisplay error={signOutError}/>}
        </div>
    );
}

export default App;
