import React from 'react';
import sum from "../../shared/utils/sum";
import {ParticipantSeriesJoined} from "../hooks/playBirdShooterGame";

interface Props {
    participantSeries: ParticipantSeriesJoined[]
    seriesCount: number
}

function Scoreboard({participantSeries, seriesCount}: Props) {
    return (
        <div className="grid grid-cols-2 divide-x-2 divide-base-300">
            {participantSeries.map((p) => (
                <div key={p.user.id} >
                    <div className="flex flex-col items-center">
                        <p>{p.user.displayName}</p>
                        <p>Punkte: {sum(...p.series)}</p>
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Serie</th>
                            <th>Punkte</th>
                        </tr>
                        </thead>
                        <tbody>
                        {p.series.map((score, round) => (
                            <tr key={`${p.user.id}-${round}`}>
                                <td>{round + 1}</td>
                                <td>{score}</td>
                            </tr>
                        ))}
                        {[...Array(seriesCount - p.series.length)].map((_, index) => (
                            <tr key={`${p.user.id}-${index + p.series.length + 1}`}>
                                <td>{index + p.series.length + 1}</td>
                                <td></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ))
            }
        </div>
    );
}

export default Scoreboard;
