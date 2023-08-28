import React from 'react';
import User, {ClubDiscipline} from "../models/User";
import useChangeClubDisciplines from '../hooks/changeClubDisciplines';
import {toast} from "react-toastify";
import {disciplineNames} from "../models/Disciplines";

interface PropsDisciplineItem {
    user: User
    discipline: ClubDiscipline
}

function DisciplineItem({user, discipline}: PropsDisciplineItem) {
    const {removeClubDiscipline} = useChangeClubDisciplines(user.id)

    const onDeleteClicked = async () => {
        await removeClubDiscipline(discipline)
        toast.success("Disziplin wurde erfolgreich entfernt!")
    }

    return <div>
        <div className="join">
            <input className="input input-bordered join-item" disabled
                   value={discipline.club}></input>
            <select className="select select-bordered join-item" disabled>
                <option>{disciplineNames[discipline.discipline]}</option>
            </select>
            <button className="btn join-item" onClick={onDeleteClicked}>🗑️</button>
        </div>
    </div>
}

export default DisciplineItem;
