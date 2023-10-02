import React from 'react';
import {JoinedPlayerStepModel} from "../models/StairClimbing.model";
import {StepGoal} from "../models/StepGoals";

interface Props {
    playerSteps: JoinedPlayerStepModel[]
    stepGoals: StepGoal[]
}

function Scoreboard({playerSteps, stepGoals}: Props) {
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
                    <td>{ps.stepIndex < stepGoals.length ? `${ps.stepIndex + 1}/${stepGoals.length}` : "Fertig"}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default Scoreboard;
