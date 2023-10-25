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
        <Link to={routes.playCompetition.buildPath({competitionId: overview.id})}
              className="btn btn-neutral leading-6 h-fit content-center grid grid-cols-[1fr,7rem]">
            <p className="text-sm">
                {overview.opponents.length > 0 ?
                    "vs " +
                    overview.opponents
                        .map(op => op.displayName)
                        .join(", ") :
                    "bisher niemanden 😥"
                }
            </p>
            <p className="flex justify-end text-sm">
                {disciplineNames[overview.discipline]}
                <br/>
                {overview.startDate.toLocaleDateString()}
            </p>
        </Link>
    )
}

export default CompetitionOverviewButton;
