import React from 'react';
import TrainingEntryModel from "../models/TrainingEntry.model";
import sum from "../../shared/utils/sum";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";

interface Props {
    entry: TrainingEntryModel

    deleteTrainingEntry(id: string): void
}

function TrainingEntryRow({entry, deleteTrainingEntry}: Props) {
    const date = entry.startDate.toLocaleDateString()
    const startTime = entry.startDate.toLocaleTimeString().substring(0, 5)
    const endTime = entry.endDate.toLocaleTimeString().substring(0, 5)
    const seriesSum = sum(...entry.series)

    function deleteEntryClicked() {
        deleteTrainingEntry(entry.id)
    }

    return <tr className="hover:bg-base-200">
        <td><span>{date}<br/>{startTime} - {endTime}</span></td>
        <td>
            <div className="flex flex-wrap gap-2">
            {entry.series.map((s, i) =>
                <span key={`${entry.id}-${i}`}>{s}</span>
            )}
            </div>
        </td>
        <td><span>{seriesSum}</span></td>
        <td><span>{entry.notes}</span></td>
        <td>
            <button className="btn btn-square btn-sm text-error"
                    onClick={deleteEntryClicked}><FontAwesomeIcon icon={faTrashCan}/></button>
        </td>
    </tr>
}

export default TrainingEntryRow;
