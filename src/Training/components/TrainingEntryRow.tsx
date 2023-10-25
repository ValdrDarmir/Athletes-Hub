import React from 'react';
import TrainingEntryModel from "../models/TrainingEntry.model";
import sum from "../../shared/utils/sum";
import Icon from "../../shared/components/Icon";

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
        <td>{date}<br/>{startTime} - {endTime}</td>
        <td>
            <div className="flex flex-wrap gap-2">
                {entry.series.map((s) => <span className="text-xs">{s}</span>)}
            </div>
        </td>
        <td>{seriesSum}</td>
        <td>{entry.notes}</td>
        <td>
            <button className="btn btn-square btn-sm text-error"
                    onClick={deleteEntryClicked}><Icon code={"delete"}/></button>
        </td>
    </tr>
}

export default TrainingEntryRow;
