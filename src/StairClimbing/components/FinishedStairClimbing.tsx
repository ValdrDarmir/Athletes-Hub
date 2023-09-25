import React from 'react';
import Scoreboard from "./Scoreboard";
import {FinishedStateHook} from "../hooks/playStairClimbing";

interface Props {
    game: FinishedStateHook
}

function FinishedStairClimbing({game}: Props) {
    return <div>
        <p>Das Spiel ist beendet.</p>
        <p>Der Gewinner ist <span className="font-bold">{game.data.winner.user.displayName}</span>!!!</p>

        <Scoreboard playerSteps={game.data.playerSteps}/>
    </div>
}

export default FinishedStairClimbing;
