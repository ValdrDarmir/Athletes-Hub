import React, {Fragment} from 'react';
import {PreGameCountDownStateHook} from "../hooks/playBirdShooterGame";
import {formatSecondsMMSS} from "../../shared/utils/formatSeconds";
import Scoreboard from "./Scoreboard";

interface Props {
    game: PreGameCountDownStateHook
}

function PreGameCountdownBirdShooterGame({game}: Props) {


    return <div className="flex items-center flex-col p-2">
        <h1 className="text-2xl">
            {game.data.participantSeries.map((p, index) => <Fragment key={`names-${p.user.id}`}>
                    {(index > 0) && <span> vs </span>}
                    <span className="font-bold">{p.user.displayName}</span>
                </Fragment>
            )}
        </h1>

        <p>Das Spiel beginnt bald. Mach dich bereit.</p>

        <p>{formatSecondsMMSS(game.data.startTimeCountdownSeconds)}</p>


        <Scoreboard participantSeries={game.data.participantSeries} seriesCount={game.data.seriesCount} />
    </div>
}

export default PreGameCountdownBirdShooterGame;
