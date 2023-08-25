import React from 'react';
import User from "../../App/models/User";
import ChangeUsernameForm from "../components/ChangeUsernameForm";
import ChangeEmailForm from "../components/ChangeEmailForm";
import ChangePasswordForm from "../components/ChangePasswordForm";

interface Props {
    user: User
}

function Profile({user}: Props) {
    return (
        <div className="m-2 flex flex-col gap-2">
            <h1 className="text-2xl">Mein Profil</h1>



            <div className="divider">Nutzername</div>
            <ChangeUsernameForm user={user} />

            <div className="divider">Email Adresse</div>
            <ChangeEmailForm user={user} />

            <div className="divider">Passwort</div>
            <ChangePasswordForm />
        </div>
    );
}

export default Profile;
