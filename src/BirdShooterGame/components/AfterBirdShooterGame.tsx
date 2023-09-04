import React from 'react';
import {AfterGameState} from "../hooks/playBirdShooterGame";

interface Props {
    game: AfterGameState
}

function AfterBirdShooterGame({game}: Props) {
        const winnerScore = game.data.hitsPerPlayer
            .find(series => series.player.id === game.data.winner.id)
            ?.currentScore

        return <div>
            <p>Das Spiel ist beendet.</p>
            <p>Der Gewinner ist <span className="font-bold">{game.data.winner.displayName}</span> mit {winnerScore}!!!</p>
        </div>
}

export default AfterBirdShooterGame;
