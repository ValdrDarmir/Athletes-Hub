import {useNavigate} from "react-router-dom";
import UserModel from "../../User/models/User.model";
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import useStairClimbingInvitation from "../hooks/stairClimbingInvitation";
import Games, {gameNames} from "../../ChallengeGeneral/models/Games";
import {useTypedParams} from "react-router-typesafe-routes/dom";
import {routes} from "../../routes";
import React from "react";

interface Props {
    user: UserModel
}

function Invitation({user}: Props) {
    const {gameId} = useTypedParams(routes.inviteStairClimbing)
    const {
        game,
        isUserAlreadyAttending,
        addPlayer,
        loading,
        error,
    } = useStairClimbingInvitation(gameId, user);

    const navigate = useNavigate()


    if (loading) {
        return <p>loading...</p>
    }

    if (error || !game) {
        return <ErrorDisplay error={error}/>
    }

    const onJoinButtonClicked = async () => {
        await addPlayer();
        navigate(routes.playStairClimbing.buildPath({gameId: gameId}))
    }

    if (isUserAlreadyAttending) {
        return <p>Du bist bereits dabei!</p>
    }

    return <div className="flex flex-col items-center m-8 gap-8">
        <h1 className="text-3xl text-primary mt-5 uppercase">Schiessspiel</h1>

        <p className="text-center">Willst du mitmachen?<br/>Es
            wird {gameNames[Games.StairClimbing]} mit {game.stepGoals.length} Stufen gespielt.</p>

        <button className="btn btn-secondary" onClick={onJoinButtonClicked}>
            Bin dabei!
        </button>

        <p className="text-center">Fordere deine Freunde mit dem beliebten Schießspiel Treppensteigen heraus! Wer
            schafft die meisten Stufen und wird das Spiel gewinnen?</p>
    </div>
}

export default Invitation;
