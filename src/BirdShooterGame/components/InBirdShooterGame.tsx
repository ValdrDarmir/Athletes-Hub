import React, {Fragment} from 'react';
import {InGameState} from "../hooks/playBirdShooterGame";

interface Props {
    game: InGameState
}

function InBirdShooterGame({game}: Props) {
    const scoreClicked = (score: number) => {
        void game.actions.newHit(score)
    }

    return <div className="flex items-center flex-col p-2">
        <h1 className="text-2xl">
            {game.data.hitsPerPlayer.map((series, index) => <Fragment key={`names-${index}`}>
                    {(index > 0) && <span> vs </span>}
                    <span className="font-bold">{series.player.displayName}</span>
                </Fragment>
            )}
        </h1>

        <p>Runde {game.data.currentRound}</p>
        <p>An der Reihe ist {game.data.currentPlayer.displayName}</p>

        <div className="card bg-base-100/90">
            <div className="card-body grid grid-cols-3">
                <button className="btn" onClick={() => scoreClicked(9)}>9</button>
                <button className="btn" onClick={() => scoreClicked(10)}>10</button>
                <button className="btn" onClick={() => scoreClicked(11)}>11</button>
                <button className="btn" onClick={() => scoreClicked(12)}>12</button>
                <button className="btn" onClick={() => scoreClicked(0)}>Daneben</button>
            </div>
        </div>

        <div className="grid grid-flow-col">
            {
                game.data.hitsPerPlayer.map((series, index) => (
                    <Fragment key={series.player.id}>
                        {(index > 0) && <div className="divider divider-horizontal"></div>}
                        <div className="card bg-base-100">
                            <div className="flex flex-col items-center">
                                <p>{series.player.displayName}</p>
                                <p>Punkte: {series.currentScore}</p>
                            </div>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Runde</th>
                                    <th>Treffer</th>
                                </tr>
                                </thead>
                                <tbody>
                                {series.series.map((score, round) => (
                                    <tr key={`${series.player.id}-${round}`}>
                                        <td>{round + 1}</td>
                                        <td>{score}</td>
                                    </tr>
                                ))}
                                {[...Array(game.data.maxRounds - series.series.length)].map((_, index) => (
                                    <tr key={`${series.player.id}-${index + series.series.length + 1}`}>
                                        <td>{index + series.series.length + 1}</td>
                                        <td></td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </Fragment>
                ))
            }
        </div>
    </div>
}

export default InBirdShooterGame;
