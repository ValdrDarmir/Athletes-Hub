import React, {Fragment} from 'react';
import {AfterCompetitionStateHook} from "../hooks/playCompetition";
import sum from "../../shared/utils/sum";
import Scoreboard from "./Scoreboard";

interface Props {
    game: AfterCompetitionStateHook
}

function AfterCompetition({game}: Props) {

    return <div className="flex flex-col items-center m-4 gap-8">

        <h1 className="text-3xl text-primary mt-5 uppercase">Wettbewerb</h1>

        <h1 className="text-2xl">
            {game.data.participantSeries.map((p, index) => <Fragment key={`names-${p.participant.user.id}`}>
                    {(index > 0) && <span> vs </span>}
                    <span className="font-bold">{p.participant.user.displayName}</span>
                </Fragment>
            )}
        </h1>

        <div className="divider uppercase">Ergebnisse</div>

        <p className="text-center">
            {game.data.participantSeries
                .sort((a, b) => sum(...b.series) > sum(...a.series) ? 1 : -1)
                .map((p, index) =>
                    index === 0 ?
                        <div key={`names-${p.participant.user.id}`} className="mb-4">
                            Gewinner<br/><b>{p.participant.user.displayName}</b>
                            <br/>
                        </div> :
                        <span key={`names-${p.participant.user.id}`}>
                            {index + 1}. {p.participant.user.displayName}
                            <br/>
                        </span>
                )}
        </p>
        <div className="divider uppercase">Details</div>

        <Scoreboard participantSeries={game.data.participantSeries} seriesCount={game.data.seriesCount}/>
    </div>
}

export default AfterCompetition;
