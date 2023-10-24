import React, {Fragment} from 'react';
import {TurnInStateHook} from "../hooks/playCompetition";
import UserModel from "../../User/models/User.model";
import {formatSecondsMMSS} from "../../shared/utils/formatSeconds";
import Scoreboard from "./Scoreboard";
import ScoreInputForm, {ScoreFormFieldsValues} from "./ScoreInputForm";
import sum from "../../shared/utils/sum";

interface Props {
    user: UserModel
    game: TurnInStateHook
}

function TurnIn({user, game}: Props) {

    const submitScore = (data: ScoreFormFieldsValues) => {
        void game.actions.newSeries(user.id, data.score)
    }

    const participantFinished = game.data.participantSeries
        .find(p => p.participant.user.id === user.id)
        ?.series.length === game.data.seriesCount

    return <div className="flex flex-col items-center m-4 gap-8">

        <h1 className="text-3xl text-primary mt-5 uppercase">Wettbewerb</h1>

        <h1 className="text-2xl border-b">
            {game.data.participantSeries.map((p, index) => <Fragment key={`names-${p.participant.user.id}`}>
                    {(index > 0) && <span> vs </span>}
                    <span className="font-bold">{p.participant.user.displayName}</span>
                </Fragment>
            )}
        </h1>

        <p className="text-center border-b">
            Aktuelles Ranking: <br/>
            {game.data.participantSeries
                .sort((a, b) => sum(...b.series) > sum(...a.series) ? 1 : -1)
                .map((p, index) => <Fragment key={`names-${p.participant.user.id}`}>
                        {index + 1}. {p.participant.user.displayName} | {sum(...p.series)}
                        <br/>
                    </Fragment>
                )}
        </p>

        <p>Die Zeit ist abgelaufen! Trage deine Ergebnisse ein.</p>

        <p className="text-center border-b">
            Restliche Eintragzeit: <br/>{formatSecondsMMSS(game.data.turnInCountdownSeconds)}
        </p>

        {participantFinished ?
            <p>Du bist fertig. Warten wir auf die anderen.</p> :
            <ScoreInputForm onSubmit={submitScore}/>
        }

        <div className="divider"></div>

        <Scoreboard participantSeries={game.data.participantSeries} seriesCount={game.data.seriesCount}/>
    </div>
}

export default TurnIn;
