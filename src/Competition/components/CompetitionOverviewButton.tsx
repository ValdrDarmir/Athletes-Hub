import React from 'react';
import {Link} from "react-router-dom";
import {CompetitionOverview} from "../hooks/userCompetitionsOverview";
import {routes} from "../../routes";
import {disciplineNames} from "../../User/models/Disciplines";

interface Props {
    overview: CompetitionOverview
}

function CompetitionOverviewButton({overview}: Props) {

    return (
        <Link to={routes.playCompetition.buildPath({competitionId: overview.id})} className="btn content-center grid grid-cols-[1fr,7rem]">
            <span>
                <span>vs </span>
                {overview.opponents.length > 0 ?
                    overview.opponents.map(op =>
                        <span className="font-bold">{op.displayName}</span>
                    )
                        .reduce((prev, curr) => <>{prev}, {curr}</>) :
                    <span className="font-bold">bisher niemanden 😥</span>
                }
            </span>
            <span className="flex justify-end">{disciplineNames[overview.discipline]}</span>
        </Link>
    )
}

export default CompetitionOverviewButton;
