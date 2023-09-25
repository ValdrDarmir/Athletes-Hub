import React from 'react';
import {Link} from "react-router-dom";
import Games, {gameNames} from "../../ChallengeGeneral/models/Games";
import {StairClimbingOverview} from "../hooks/userStairClimbingOverview";
import {ROUTES} from "../../index";

interface Props {
    overview: StairClimbingOverview
}

function StairClimbingOverviewButton({overview}: Props) {

    return (
        <Link to={ROUTES.playStairClimbing.buildPath({gameId: overview.id})} className="btn flex content-center justify-between">
            <span>
                {gameNames[Games.StairClimbing]}
                <span> gegen </span>
                {overview.opponents.length > 0 ?
                    overview.opponents.map(op =>
                        <span className="font-bold">{op.displayName}</span>
                    )
                        .reduce((prev, curr) => <>{prev}, {curr}</>) :
                    <span className="font-bold">bisher niemanden 😥</span>
                }
            </span>
        </Link>
    )
}

export default StairClimbingOverviewButton;
