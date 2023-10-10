import React, {Fragment} from 'react';
import UserModel from "../../User/models/User.model";
import {formatSecondsMMSS} from "../../shared/utils/formatSeconds";
import Scoreboard from "./Scoreboard";
import {RunningStateHook} from "../hooks/playStairClimbing";
import {toast} from "react-toastify";

interface Props {
    user: UserModel
    game: RunningStateHook
}

function RunningStairClimbing({user, game}: Props) {

    const climbStepClicked = async () => {
        const error = await game.actions.climbStep(user.id)
        if (error) {
            toast.error(error.message)
        }
    }


    return <div className="flex items-center flex-col p-2">
        <h1 className="text-2xl">
            {game.data.playerSteps.map((p, index) => <Fragment key={`names-${p.user.id}`}>
                    {(index > 0) && <span> vs </span>}
                    <span className="font-bold">{p.user.displayName}</span>
                </Fragment>
            )}
        </h1>

        <p>Los gehts. Schieß, was das Zeug hält!</p>

        <p>{formatSecondsMMSS(game.data.timeBeforeFinishSeconds)}</p>

        <div className="card bg-base-100/90">
            <p>Schusszahl: {game.data.currentStepGoalInfo.shots}</p>
            <p>{game.data.currentStepGoalInfo.scoreRange}</p>
            <p>{game.data.currentStepGoalInfo.description}</p>
        </div>


        <button className="btn" onClick={climbStepClicked}>Nächste Stufe</button>

        <div className="divider"></div>

        <Scoreboard playerSteps={game.data.playerSteps} stepGoals={game.data.stepGoals}/>
    </div>
}

export default RunningStairClimbing;
