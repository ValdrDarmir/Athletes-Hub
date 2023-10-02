import React, {Fragment} from 'react';
import {formatSecondsMMSS} from "../../shared/utils/formatSeconds";
import Scoreboard from "./Scoreboard";
import {PreStartCountDownStateHook} from "../hooks/playStairClimbing";

interface Props {
    game: PreStartCountDownStateHook
}

function PreStartCountdownStairClimbing({game}: Props) {
    return <div className="flex items-center flex-col p-2">
        <h1 className="text-2xl">
            {game.data.playerSteps.map((p, index) => <Fragment key={`names-${p.user.id}`}>
                    {(index > 0) && <span> vs </span>}
                    <span className="font-bold">{p.user.displayName}</span>
                </Fragment>
            )}
        </h1>

        <p>Das Spiel beginnt bald. Mach dich bereit.</p>

        <p>{formatSecondsMMSS(game.data.timeBeforeStartSeconds)}</p>


        <Scoreboard playerSteps={game.data.playerSteps} stepGoals={game.data.stepGoals}/>
    </div>
}

export default PreStartCountdownStairClimbing;
