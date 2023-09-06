import React from 'react';
import {AfterGameStateHook} from "../hooks/playBirdShooterGame";
import sum from "../../shared/utils/sum";
import Scoreboard from "./Scoreboard";

interface Props {
    game: AfterGameStateHook
}

function AfterBirdShooterGame({game}: Props) {
        const winnerScore = sum(...game.data.participantSeries
            .find(p => p.user.id === game.data.winner.id)
            ?.series ?? []
        )

        return <div>
            <p>Das Spiel ist beendet.</p>
            <p>Der Gewinner ist <span className="font-bold">{game.data.winner.displayName}</span> mit {winnerScore}!!!</p>

            <Scoreboard participantSeries={game.data.participantSeries} seriesCount={game.data.seriesCount} />
        </div>
}

export default AfterBirdShooterGame;
