import React, {Fragment} from 'react';
import UserModel from "../../User/models/User.model";
import useTrainingEntries from "../hooks/trainingEntries";
import groupObjects from "../../shared/utils/groupObjects";
import {disciplineNames} from "../../User/models/Disciplines";
import TrainingEntryRow from '../components/TrainingEntryRow';
import {Link} from "react-router-dom";
import {routes} from "../../routes";

interface Props {
    user: UserModel
}

function Training({user}: Props) {
    const {trainingEntries} = useTrainingEntries(user.id)

    const trainingEntriesByDiscipline = trainingEntries && groupObjects("discipline", ...trainingEntries)

    return (
        <div className="m-2 flex flex-col items-center">
            <h1 className="text-3xl mb-2">Trainingsdaten</h1>

            <Link to={routes.training.path} className="btn btn-primary">Neue Daten hinzufügen</Link>

            {trainingEntriesByDiscipline && trainingEntriesByDiscipline.map(({group, values}) =>
                <Fragment key={group}>
                    <div className="divider divide-"></div>
                    <div className="mb-2 flex flex-col items-center">
                        <h2 className="text-2xl">{disciplineNames[group]}</h2>
                        <table className="table table-fixed table-sm table-pin-rows">
                            <thead>
                            <tr>
                                <th className="w-32">Datum</th>
                                <th className="w-20">Serien</th>
                                <th className="w-16">Summe</th>
                                <th>Notizen</th>
                            </tr>
                            </thead>
                            <tbody>
                            {values.map(entry =>
                                <TrainingEntryRow key={entry.id} entry={entry}/>
                            )}
                            </tbody>
                        </table>
                    </div>
                </Fragment>
            )}
        </div>
    );
}

export default Training;
