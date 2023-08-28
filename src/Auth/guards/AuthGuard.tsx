import React, {ReactNode, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import User from '../../User/models/User';
import useAuthenticatedUser from "../hooks/authenticatedUser";
import ErrorDisplay from "../../shared/components/ErrorDisplay";

interface Props {
    component: React.FC<{ user: User }>,
    layout: React.FC<{ user: User | undefined, children: ReactNode }>,
    redirectRoute: string,
}

const AuthGuard = ({component, layout, redirectRoute,}: Props) => {
    const [user, userLoading, userError] = useAuthenticatedUser()
    const navigate = useNavigate();

    // navigate needs to be run in a useEffect, not while rendering
    useEffect(() => {
        if (!user && !userLoading && !userError) {
            navigate(redirectRoute)
        }
    }, [navigate, redirectRoute, user, userError, userLoading])

    if (userLoading || !user) {
        return <p>Loading...</p>
    }

    if (userError) {
        return <ErrorDisplay error={userError} />
    }

    const Layout = layout
    const Component = component

    return <Layout user={user}>
        <Component user={user}/>
    </Layout>
}

export default AuthGuard;
