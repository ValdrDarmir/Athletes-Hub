import React, {Fragment} from 'react';
import {TimeRunningStateHook} from "../hooks/playBirdShooterGame";
import UserModel from "../../User/models/User.model";
import {formatSecondsMMSS} from "../../shared/utils/formatSeconds";
import Scoreboard from "./Scoreboard";

interface Props {
    user: UserModel
    game: TimeRunningStateHook
}

function TimeRunningBirdShooterGame({user, game}: Props) {

    const scoreClicked = (score: number) => {
        void game.actions.newHit(user.id, score)
    }

    const participantFinished = game.data.participantSeries
        .find(p => p.user.id === user.id)
        ?.series.length === game.data.seriesCount

    return <div className="flex items-center flex-col p-2">
        <h1 className="text-2xl">
            {game.data.participantSeries.map((p, index) => <Fragment key={`names-${p.user.id}`}>
                    {(index > 0) && <span> vs </span>}
                    <span className="font-bold">{p.user.displayName}</span>
                </Fragment>
            )}
        </h1>

        <p>Los gehts. Schieß, was das Zeug hält!</p>

        <p>{formatSecondsMMSS(game.data.timeUpCountdownSeconds)}</p>

        {participantFinished ?
            <p>Du bist fertig. Warten wir auf die anderen.</p> :
            <div className="card bg-base-100/90">
                <div className="card-body grid grid-cols-3">
                    <button className="btn" onClick={() => scoreClicked(9)}>9</button>
                    <button className="btn" onClick={() => scoreClicked(10)}>10</button>
                    <button className="btn" onClick={() => scoreClicked(11)}>11</button>
                    <button className="btn" onClick={() => scoreClicked(12)}>12</button>
                    <button className="btn" onClick={() => scoreClicked(0)}>Daneben</button>
                </div>
            </div>
        }

        <Scoreboard participantSeries={game.data.participantSeries} seriesCount={game.data.seriesCount}/>
    </div>
}

export default TimeRunningBirdShooterGame;
