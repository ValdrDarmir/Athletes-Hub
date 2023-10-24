import React from 'react';
import UserModel from "../models/User.model";
import ChangeUsernameForm from "../components/ChangeUsernameForm";
import ChangeEmailForm from "../components/ChangeEmailForm";
import ChangePasswordForm from "../components/ChangePasswordForm";
import DisciplineItem from '../components/DisciplineItem';
import NewDiscipline from "../components/NewDiscipline";
import {useCollectionData} from 'react-firebase-hooks/firestore';
import db from "../../shared/utils/db";
import {query} from 'firebase/firestore';
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import whereTyped from "../../shared/utils/whereTyped";
import ClubDisciplineModel from "../models/ClubDiscipline.model";
import {useSignOut} from "react-firebase-hooks/auth";
import {auth} from "../../shared/utils/firebase";

interface Props {
    user: UserModel
}

function Profile({user}: Props) {
    const [signOut, signOutLoading, signOutError] = useSignOut(auth);
    const [clubDisciplines, clubDisciplinesLoading, clubDisciplinesError] = useCollectionData(query(db.clubDisciplines, whereTyped<ClubDisciplineModel>("userId", "==", user.id)))

    if (clubDisciplinesLoading) return <div>Loading...</div>

    if (clubDisciplinesError || !clubDisciplines) {
        const noClubDisciplinesError = !clubDisciplines && new Error("No club disciplines found")
        const error = clubDisciplinesError || noClubDisciplinesError

        return <ErrorDisplay error={error}/>
    }

    // TODO: Change clubs into grid
    return (
        <div className="m-4 flex flex-col justify-stretch gap-4">
            <h1 className="text-3xl text-primary self-center uppercase">Profil</h1>

            <div className="divider uppercase">Meine Disziplinen</div>
            {clubDisciplines.map((discipline, i) =>
                <DisciplineItem key={i} clubDiscipline={discipline}/>
            )}
            <NewDiscipline user={user}/>

            <div className="divider uppercase">Account</div>

            <div className="collapse collapse-arrow btn-neutral text-neutral-content/50">
                <input type="checkbox"/>
                <summary className="collapse-title">Nutzername ändern</summary>
                <div className="collapse-content">
                    <ChangeUsernameForm user={user}/>
                </div>
            </div>

            <div className="collapse collapse-arrow btn-neutral text-neutral-content/50">
                <input type="checkbox"/>
                <summary className="collapse-title">Email Adresse ändern</summary>
                <div className="collapse-content">
                    <ChangeEmailForm user={user}/>
                </div>
            </div>

            <div className="collapse collapse-arrow btn-neutral text-neutral-content/50">
                <input type="checkbox"/>
                <summary className="collapse-title">Passwort ändern</summary>
                <div className="collapse-content">
                    <ChangePasswordForm/>
                </div>
            </div>

            <button className="btn btn-error mb-2 uppercase" onClick={signOut} disabled={signOutLoading}>Logout</button>
            {signOutError && <ErrorDisplay error={signOutError}/>}
        </div>
    );
}

export default Profile;
