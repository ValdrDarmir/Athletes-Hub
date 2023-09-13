import React from 'react';
import UserModel from "../models/User.model";
import {useForm} from "react-hook-form";
import Disciplines, {disciplineNames} from "../models/Disciplines";
import useChangeClubDisciplines from '../hooks/changeClubDisciplines';
import {toast} from "react-toastify";

interface Props {
    user: UserModel
}

interface ClubDisciplineFieldValues {
    club: string
    discipline: Disciplines
}

function NewDiscipline({user}: Props) {
    const {addClubDiscipline} = useChangeClubDisciplines(user.id)
    const {register, handleSubmit, formState: {errors}, reset} = useForm<ClubDisciplineFieldValues>();

    const onSubmit = async (data: ClubDisciplineFieldValues) => {
            await addClubDiscipline(data)
            reset()
            toast.success("Disziplin wurde erfolgreich hinzugefügt!")
    }

    return <form onSubmit={handleSubmit(onSubmit)}>
        <div className="join">
            <input className="input input-bordered join-item"
                   placeholder="Vereinsname" {...register("club", {required: true})}/>
            <select className="select select-bordered join-item" defaultValue={""} {...register("discipline", {required: true})}>
                <option value={""} disabled>Disziplin</option>
                <option value={Disciplines.AirRifle}>{disciplineNames[Disciplines.AirRifle]}</option>
                <option value={Disciplines.Pistol}>{disciplineNames[Disciplines.Pistol]}</option>
            </select>
            <button className="btn join-item" type="submit">➕</button>
        </div>
        {errors.club && <label className={"label"}><span
            className={"label-text-alt text-error"}>Vereinsname is required</span></label>}
        {errors.discipline && <label className={"label"}><span
            className={"label-text-alt text-error"}>Disziplin is required</span></label>}
    </form>
}

export default NewDiscipline;
