import React, {Fragment} from 'react';
import {formatSecondsMMSS} from "../../shared/utils/formatSeconds";
import Scoreboard from "./Scoreboard";
import {PreStartCountDownStateHook} from "../hooks/playStairClimbing";

interface Props {
    game: PreStartCountDownStateHook
}

function PreStartCountdownStairClimbing({game}: Props) {
    return <div className="flex flex-col items-center m-4 gap-4">
        <h1 className="text-3xl text-primary mt-5 uppercase">Schiessspiel</h1>

        <h1 className="text-2xl border-b">
            {game.data.playerSteps.map((p, index) => <Fragment key={`names-${p.user.id}`}>
                    {(index > 0) && <span> vs </span>}
                    <span className="font-bold">{p.user.displayName}</span>
                </Fragment>
            )}
        </h1>

        <div className="divider">Vorbereitungszeit</div>
        <p className="text-center">{formatSecondsMMSS(game.data.timeBeforeStartSeconds)}</p>

        <div className="divider">Aktuelles Ranking</div>
        <Scoreboard playerSteps={game.data.playerSteps} stepGoals={game.data.stepGoals}/>
    </div>
}

export default PreStartCountdownStairClimbing;
