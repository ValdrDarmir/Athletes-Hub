import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import useAuthenticatedUser from "../hooks/authenticatedUser";

interface Props {
    component: React.FC,
    redirectRoute: string,
}

const AuthGuard = ({component, redirectRoute,}: Props) => {
    const [user, userLoading, userError] = useAuthenticatedUser()
    const navigate = useNavigate();


    // navigate needs to be run in a useEffect, not while rendering
    useEffect(() => {
        if (user && !userLoading && !userError) {
            navigate(redirectRoute)
        }
    }, [navigate, redirectRoute, user, userError, userLoading])

    if (userLoading) {
        return <p>Loading...</p>
    }

    if (userError) {
        return <p>Error: {userError.message}</p>
    }

    const Component = component
    return <Component />
}

export default AuthGuard;
