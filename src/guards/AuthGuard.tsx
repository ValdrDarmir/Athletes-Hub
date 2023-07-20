import {User} from 'firebase/auth';
import React from 'react';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../utils/firebase";
import {useNavigate} from "react-router-dom";

interface Props {
    component: React.FC<{ user: User }>,
    redirectRoute: string,
}

const AuthGuard = ({component, redirectRoute,}: Props) => {
    const [user, loadingUser, errorUser] = useAuthState(auth)
    const navigate = useNavigate();

    if (loadingUser) {
        return <p>Loading...</p>
    }

    if (errorUser) {
        return <p>Error: {errorUser.message}</p>
    }

    if (!user) {
        navigate(redirectRoute)
        return <p>Loading...</p>
    }

    const Component = component
    return <Component user={user}/>
}

export default AuthGuard;
