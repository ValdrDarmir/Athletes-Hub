import React, {Fragment} from 'react';
import {PreStartCountDownStateHook} from "../hooks/playCompetition";
import {formatSecondsMMSS} from "../../shared/utils/formatSeconds";
import Scoreboard from "./Scoreboard";

interface Props {
    game: PreStartCountDownStateHook
}

function PreStartCountdown({game}: Props) {


    return <div className="flex items-center flex-col p-2">
        <h1 className="text-2xl">
            {game.data.participantSeries.map((p, index) => <Fragment key={`names-${p.participant.user.id}`}>
                    {(index > 0) && <span> vs </span>}
                    <span className="font-bold">{p.participant.user.displayName}</span>
                </Fragment>
            )}
        </h1>

        <p>Das Spiel beginnt bald. Mach dich bereit.</p>

        <p>{formatSecondsMMSS(game.data.startTimeCountdownSeconds)}</p>


        <Scoreboard participantSeries={game.data.participantSeries} seriesCount={game.data.seriesCount} />
    </div>
}

export default PreStartCountdown;
