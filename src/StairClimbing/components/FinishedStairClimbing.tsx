import React, {Fragment} from 'react';
import Scoreboard from "./Scoreboard";
import {FinishedStateHook} from "../hooks/playStairClimbing";

interface Props {
    game: FinishedStateHook
}

function FinishedStairClimbing({game}: Props) {
    return <div className="flex flex-col items-center m-4 gap-4">
        <h1 className="text-3xl text-primary mt-5 uppercase">Schiessspiel</h1>

        <h1 className="text-2xl">
            {game.data.playerSteps.map((p, index) => <Fragment key={`names-${p.user.id}`}>
                    {(index > 0) && <span> vs </span>}
                    <span className="font-bold">{p.user.displayName}</span>
                </Fragment>
            )}
        </h1>

        <div className="divider uppercase">Ergebnisse</div>

        <p className="text-center">
            {game.data.playerSteps
                .sort((a, b) => b.stepIndex > a.stepIndex ? 1 : -1)
                .map((p, index) =>
                    index === 0 ?
                        <div key={`names-${p.user.id}`} className="mb-4">
                            Gewinner<br/><b>{p.user.displayName}</b>
                            <br/>
                        </div> :
                        <span key={`names-${p.user.id}`}>
                            {index + 1}. {p.user.displayName}
                            <br/>
                        </span>
                )}
        </p>
        <div className="divider uppercase">Details</div>

        <Scoreboard playerSteps={game.data.playerSteps} stepGoals={game.data.stepGoals}/>
    </div>
}

export default FinishedStairClimbing;
