import React from 'react';
import './App.module.css';
import db from "../../utils/db";
import {useCollection} from "react-firebase-hooks/firestore";
import {User} from "firebase/auth";
import {useSignOut} from "react-firebase-hooks/auth";
import {auth} from "../../utils/firebase";

interface Props {
    user: User
}

function App({user}: Props) {

    const [value, loading, error] = useCollection(db.tests);
    const [signOut, signOutLoading, signOutError] = useSignOut(auth);

    return (
        <div className="flex flex-col align-middle">
            <h1>Hallo {user.displayName}</h1>
            <p>Hier sind ein paar Daten.</p>
            <ul>
                <li>
                    <a>Login/Register</a>
                </li>
                <li>
                    <a>Play Challenge</a>
                </li>
                <li>
                    <a>My Statistics</a>
                </li>
                <li>
                    <a>My Profile?</a>
                </li>
                {
                    loading && (
                        <span>loading...</span>
                    )
                }
                {
                    value && value.docs.map(doc =>
                        <li key={doc.id}>
                            Name: {doc.data().name}
                        </li>
                    )
                }
            </ul>
            <button onClick={signOut} disabled={signOutLoading}>Logout</button>
            {signOutError && <p>{signOutError.message}</p>}
        </div>
    );
}

export default App;
