import React from 'react';
import TrainingEntryModel from "../models/TrainingEntry.model";
import sum from "../../shared/utils/sum";

interface Props {
    entry: TrainingEntryModel
}

function TrainingEntryRow({entry}: Props) {
    const date = entry.startDate.toLocaleDateString()
    const startTime = entry.startDate.toLocaleTimeString().substring(0, 5)
    const endTime = entry.endDate.toLocaleTimeString().substring(0, 5)
    const seriesSum = sum(...entry.series)

    return <tr>
        <td>{date}<br/>{startTime} - {endTime}</td>
        <td>
            {entry.series.map((s, i) =>
                <span key={`${entry.id}-${i}`} className="badge badge-ghost badge-sm">{s}</span>
            )}
        </td>
        <td><span className="badge badge-ghost badge-sm">{seriesSum}</span></td>
        <td>{entry.notes}</td>
    </tr>
}

export default TrainingEntryRow;
