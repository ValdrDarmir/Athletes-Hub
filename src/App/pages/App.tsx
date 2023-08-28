import React from 'react';
import {useSignOut} from "react-firebase-hooks/auth";
import {Link} from "react-router-dom";
import {auth} from '../../shared/utils/firebase';
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import User from "../../User/models/User";

interface Props {
    user: User
}

function App({user}: Props) {
    const [signOut, signOutLoading, signOutError] = useSignOut(auth);

    const userHasNoDisciplines = user.disciplines.length === 0

    return (
        <div className="flex flex-col items-stretch p-2">
            <h1 className="self-center text-2xl mb-2">Hallo {user.displayName}</h1>

            <Link to="/games" className="btn mb-2">Meine Challenges</Link>
            <Link to="/game" className="btn mb-2">Neue Challenge starten!</Link>
            <Link to="/stats" className="btn mb-2">Statistiken</Link>
            <div className="divider"></div>

            <div className={`tooltip ${userHasNoDisciplines && "tooltip-open"} tooltip-info`} data-tip="Trage deinen Verein und Disziplin ein">
                <Link to="/profile" className="btn mb-2">Profil bearbeiten</Link>
            </div>
            <button className="btn btn-outline mb-2" onClick={signOut} disabled={signOutLoading}>Logout</button>
            {signOutError && <ErrorDisplay error={signOutError}/>}
        </div>
    );
}

export default App;
