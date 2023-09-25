import React from 'react';
import {JoinedPlayerStepModel} from "../models/StairClimbing.model";

interface Props {
    playerSteps: JoinedPlayerStepModel[]
}

function Scoreboard({playerSteps}: Props) {
    return (
        <table className="table">
            <thead>
            <tr>
                <th>Spieler</th>
                <th>Stufe</th>
            </tr>
            </thead>
            <tbody>
            {playerSteps.map((ps) => (
                <tr key={`score-${ps.user.id}`}>
                    <td>{ps.user.displayName}</td>
                    <td>{ps.stepIndex}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default Scoreboard;
