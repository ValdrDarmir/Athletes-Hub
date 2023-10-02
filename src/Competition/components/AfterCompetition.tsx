import React from 'react';
import {AfterCompetitionStateHook} from "../hooks/playCompetition";
import sum from "../../shared/utils/sum";
import Scoreboard from "./Scoreboard";

interface Props {
    game: AfterCompetitionStateHook
}

function AfterCompetition({game}: Props) {
        const winnerScore = sum(...game.data.participantSeries
            .find(p => p.participant.user.id === game.data.winner.id)
            ?.series ?? []
        )

        return <div>
            <p>Das Spiel ist beendet.</p>
            <p>Der Gewinner ist <span className="font-bold">{game.data.winner.displayName}</span> mit {winnerScore}!!!</p>

            <Scoreboard participantSeries={game.data.participantSeries} seriesCount={game.data.seriesCount} />
        </div>
}

export default AfterCompetition;
