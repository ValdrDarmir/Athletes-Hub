import React from 'react';
import {Link} from "react-router-dom";
import {BirdShooterGameOverview} from "../hooks/userBirdShooterGamesOverview";

interface Props {
    overview: BirdShooterGameOverview
}

function BirdShooterOverviewButton({overview}: Props) {

    return (
        <Link to={`/game/${overview.id}`} className="btn flex content-center justify-between">
            <span>
                <span>gegen </span>
                {overview.opponents.length > 0 ?
                    overview.opponents.map(op =>
                        <span className="font-bold">{op.displayName}</span>
                    )
                        .reduce((prev, curr) => <>{prev}, {curr}</>) :
                    <span className="font-bold">bisher niemanden 😥</span>
                }
            </span>
            {overview.winner ?
                <span>Gewinner: {overview.winner.displayName}</span> :
                <span>Runde: {overview.round}/{overview.maxRounds}</span>
            }
        </Link>
    )
}

export default BirdShooterOverviewButton;
