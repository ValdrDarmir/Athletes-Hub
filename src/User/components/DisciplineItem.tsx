import React from 'react';
import User from "../models/User";
import useChangeClubDisciplines from '../hooks/changeClubDisciplines';
import {toast} from "react-toastify";
import {disciplineNames} from "../models/Disciplines";
import ClubDiscipline from '../models/ClubDiscipline';

interface PropsDisciplineItem {
    user: User
    clubDiscipline: ClubDiscipline
}

function DisciplineItem({user, clubDiscipline}: PropsDisciplineItem) {
    const {removeClubDiscipline} = useChangeClubDisciplines(user.id)

    const onDeleteClicked = async () => {
        await removeClubDiscipline(clubDiscipline.id)
        toast.success("Disziplin wurde erfolgreich entfernt!")
    }

    return <div>
        <div className="join">
            <input className="input input-bordered join-item" disabled
                   value={clubDiscipline.club}></input>
            <select className="select select-bordered join-item" disabled>
                <option>{disciplineNames[clubDiscipline.discipline]}</option>
            </select>
            <button className="btn join-item" onClick={onDeleteClicked}>🗑️</button>
        </div>
    </div>
}

export default DisciplineItem;
