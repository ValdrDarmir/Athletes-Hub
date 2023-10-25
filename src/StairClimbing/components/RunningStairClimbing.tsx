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


    return <div className="flex flex-col items-center m-4 gap-4">
        <h1 className="text-3xl text-primary mt-5 uppercase">Schiessspiel</h1>

        <h1 className="text-2xl border-b">
            {game.data.playerSteps.map((p, index) => <Fragment key={`names-${p.user.id}`}>
                    {(index > 0) && <span> vs </span>}
                    <span className="font-bold">{p.user.displayName}</span>
                </Fragment>
            )}
        </h1>

        <div className="divider">Schießzeit</div>
        <p className="text-center">{formatSecondsMMSS(game.data.timeBeforeFinishSeconds)}</p>

        <div className="divider">Aktuelle Stufe</div>

        <p className="text-center">
            Schussanzahl: {game.data.currentStepGoalInfo.shots} <br/>
            Ziel: {game.data.currentStepGoalInfo.scoreRange} <br/>
            <br/>
            {game.data.currentStepGoalInfo.description} <br/>
        </p>

        <button className="btn btn-secondary" onClick={climbStepClicked}>Ziel erreicht</button>

        <div className="divider">Aktuelles Ranking</div>
        <Scoreboard playerSteps={game.data.playerSteps} stepGoals={game.data.stepGoals}/>
    </div>
}

export default RunningStairClimbing;
