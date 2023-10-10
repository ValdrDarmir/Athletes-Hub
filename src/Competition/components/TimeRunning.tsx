import React, {Fragment} from 'react';
import {TimeRunningStateHook} from "../hooks/playCompetition";
import UserModel from "../../User/models/User.model";
import {formatSecondsMMSS} from "../../shared/utils/formatSeconds";
import Scoreboard from "./Scoreboard";
import ScoreInputForm, {ScoreFormFieldsValues} from "./ScoreInputForm";

interface Props {
    user: UserModel
    game: TimeRunningStateHook
}

function TimeRunning({user, game}: Props) {

    const submitScore = (data: ScoreFormFieldsValues) => {
        void game.actions.newSeries(user.id, data.score)
    }

    const participantFinished = game.data.participantSeries
        .find(p => p.participant.user.id === user.id)
        ?.series.length === game.data.seriesCount

    return <div className="flex items-center flex-col p-2">
        <h1 className="text-2xl">
            {game.data.participantSeries.map((p, index) => <Fragment key={`names-${p.participant.user.id}`}>
                    {(index > 0) && <span> vs </span>}
                    <span className="font-bold">{p.participant.user.displayName}</span>
                </Fragment>
            )}
        </h1>

        <p>Los gehts. Schieß, was das Zeug hält!</p>

        <p>{formatSecondsMMSS(game.data.timeUpCountdownSeconds)}</p>

        {participantFinished ?
            <p>Du bist fertig. Warten wir auf die anderen.</p> :
            <ScoreInputForm onSubmit={submitScore} />
        }

        <div className="divider"></div>

        <Scoreboard participantSeries={game.data.participantSeries} seriesCount={game.data.seriesCount}/>
    </div>
}

export default TimeRunning;
