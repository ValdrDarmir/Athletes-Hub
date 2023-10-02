import React from 'react';
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import UserModel from "../../User/models/User.model";
import useStairClimbingInvitation from "../hooks/stairClimbingInvitation";

interface Props {
    gameId: string
    user: UserModel
}

function CreatorJoin({gameId, user}: Props) {
    const {
        isUserAlreadyAttending,
        loading,
        error,
        addPlayer,
    } = useStairClimbingInvitation(gameId, user);


    if (loading) {
        return <p>loading...</p>
    }

    if (error) {
        return <ErrorDisplay error={error}/>
    }

    const onJoinButtonClicked = async () => {
        await addPlayer();
    }

    if (isUserAlreadyAttending) {
        return <p>Du bist dabei!</p>
    }

    return (
        <div>
            <div className="flex flex-col gap-2">
                <p>Willst du auch mitmachen?</p>

                <button className="btn" onClick={onJoinButtonClicked}>
                    Bin dabei!
                </button>
            </div>
        </div>
    );
}

export default CreatorJoin;
