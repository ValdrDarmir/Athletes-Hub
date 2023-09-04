import React from 'react';
import UserModel from "../models/User.model";
import ChangeUsernameForm from "../components/ChangeUsernameForm";
import ChangeEmailForm from "../components/ChangeEmailForm";
import ChangePasswordForm from "../components/ChangePasswordForm";
import DisciplineItem from '../components/DisciplineItem';
import NewDiscipline from "../components/NewDiscipline";
import {useCollectionData} from 'react-firebase-hooks/firestore';
import db from "../../shared/utils/db";
import {query, where} from 'firebase/firestore';
import ErrorDisplay from "../../shared/components/ErrorDisplay";

interface Props {
    user: UserModel
}

function Profile({user}: Props) {
    const [clubDisciplines, clubDisciplinesLoading, clubDisciplinesError] = useCollectionData(query(db.clubDisciplines, where("userId", "==", user.id)))

    if(clubDisciplinesLoading) return <div>Loading...</div>

    if(clubDisciplinesError || !clubDisciplines) {
        const noClubDisciplinesError = !clubDisciplines && new Error("No club disciplines found")
        const error = clubDisciplinesError || noClubDisciplinesError

        return <ErrorDisplay error={error}/>
    }

    return (
        <div className="m-2 flex flex-col gap-2">
            <h1 className="text-2xl">Mein Profil</h1>

            <div className="divider">Meine Disziplinen</div>
            {clubDisciplines.map((discipline, i) =>
                <DisciplineItem key={i} user={user} clubDiscipline={discipline}/>)
            }
            <NewDiscipline user={user}/>

            <div className="divider">Nutzername</div>
            <ChangeUsernameForm user={user}/>

            <div className="divider">Email Adresse</div>
            <ChangeEmailForm user={user}/>

            <div className="divider">Passwort</div>
            <ChangePasswordForm/>
        </div>
    );
}

export default Profile;
