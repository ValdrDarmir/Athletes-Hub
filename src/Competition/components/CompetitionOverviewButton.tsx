import React from 'react';
import {Link} from "react-router-dom";
import {CompetitionOverview} from "../hooks/userCompetitionsOverview";

interface Props {
    overview: CompetitionOverview
}

function CompetitionOverviewButton({overview}: Props) {

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
        </Link>
    )
}

export default CompetitionOverviewButton;
