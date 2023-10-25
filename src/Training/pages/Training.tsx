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
    const {trainingEntries, deleteTrainingEntry} = useTrainingEntries(user.id)

    const trainingEntriesByDiscipline = trainingEntries && groupObjects("discipline", ...trainingEntries)

    return (
        <div className="m-2 flex flex-col items-center">
            <h1 className="text-3xl text-primary my-4 uppercase">Trainingsdoku</h1>

            <Link to={routes.newTrainingEntry.path} className="btn btn-secondary uppercase mb-4">Neue Session</Link>

            {trainingEntriesByDiscipline && trainingEntriesByDiscipline.map(({group, values}) =>
                <Fragment key={group}>
                    <div className="divider uppercase">{disciplineNames[group]}</div>
                    <table className=" table table-fixed table-zebra table-xs table-pin-rows">
                        <colgroup>
                            <col className="w-1/4"/>
                            <col className="w-1/5"/>
                            <col className="w-1/5"/>
                            <col className=""/>
                            <col className="w-12"/>
                        </colgroup>
                        <thead>
                        <tr className="border-b border-white">
                            <th>Datum</th>
                            <th>Serien</th>
                            <th>Summe</th>
                            <th>Notizen</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {values.map(entry =>
                            <TrainingEntryRow key={entry.id} entry={entry}
                                              deleteTrainingEntry={deleteTrainingEntry}/>
                        )}
                        </tbody>
                    </table>
                </Fragment>
            )}
        </div>
    );
}

export default Training;
