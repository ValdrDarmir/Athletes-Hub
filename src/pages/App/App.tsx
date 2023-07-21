import React from 'react';
import './App.module.css';
import {useSignOut} from "react-firebase-hooks/auth";
import {auth} from "../../utils/firebase";
import User from "../../models/User";
import {Link} from "react-router-dom";

interface Props {
    user: User
}

function App({user}: Props) {
    const [signOut, signOutLoading, signOutError] = useSignOut(auth);

    return (
        <div className="flex flex-col items-stretch p-2">
            <h1>Hallo {user.displayName}</h1>

            <Link to="/games" className="btn mb-2">Meine Challenges</Link>
            <Link to="/game" className="btn mb-2">Neue Challenge starten!</Link>
            <Link to="#" className="btn mb-2">Statistiken (Todo)</Link>
            <div className="divider"></div>

            <Link to="#" className="btn mb-2">Profil bearbeiten (Todo)</Link>
            <button className="btn btn-outline mb-2" onClick={signOut} disabled={signOutLoading}>Logout</button>
            {signOutError && <p>{signOutError.message}</p>}
        </div>
    );
}

export default App;
