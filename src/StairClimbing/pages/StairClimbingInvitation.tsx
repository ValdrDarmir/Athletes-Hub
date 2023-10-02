import {useNavigate} from "react-router-dom";
import UserModel from "../../User/models/User.model";
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import useStairClimbingInvitation from "../hooks/stairClimbingInvitation";
import Games, {gameNames} from "../../ChallengeGeneral/models/Games";
import {useTypedParams} from "react-router-typesafe-routes/dom";
import {routes} from "../../routes";

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

    return (
        <div>
            <div className="flex flex-col gap-2">
                <p>Willst du mitspielen? Es wird {gameNames[Games.StairClimbing]} mit {game.stepGoals.length} Stufen gespielt.</p>

                <button className="btn" onClick={onJoinButtonClicked}>
                    Bin dabei!
                </button>
            </div>
        </div>
    );
}

export default Invitation;
