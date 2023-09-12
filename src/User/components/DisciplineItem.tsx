import React from 'react';
import {disciplineNames} from "../models/Disciplines";
import ClubDisciplineModel from '../models/ClubDiscipline.model';

interface PropsDisciplineItem {
    clubDiscipline: ClubDisciplineModel
}

function DisciplineItem({clubDiscipline}: PropsDisciplineItem) {
    return <div>
        <div className="join">
            <input className="input input-bordered join-item" disabled
                   value={clubDiscipline.club}></input>
            <select className="select select-bordered join-item" disabled>
                <option>{disciplineNames[clubDiscipline.discipline]}</option>
            </select>
        </div>
    </div>
}

export default DisciplineItem;
