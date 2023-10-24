import React from 'react';
import Disciplines, {disciplineNames} from "../../User/models/Disciplines";
import {useFieldArray, useForm} from "react-hook-form";
import setTimeOfDate from "../../shared/utils/setTimeOfDate";
import {toast} from "react-toastify";
import {TrainingEntriesHook} from "../hooks/trainingEntries";
import isNumber from "../../shared/utils/isNumber";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";

interface Props {
    addTrainingEntry: TrainingEntriesHook["addTrainingEntry"]
}

interface TrainingEntryFieldValues {
    discipline: Disciplines
    date: Date
    startTime: string
    endTime: string
    notes: string | null
    series: { score: number | null }[]
}

function AddTrainingEntryForm({addTrainingEntry}: Props) {

    const currentHour = new Date().getHours()
    const defaultValues = {
        // bug in library, that prevents the correct type as default value
        date: new Date().toISOString().substring(0, 10) as unknown as Date,
        startTime: `${currentHour}:00`,
        endTime: `${currentHour + 2}:00`,
        series: [{score: null}],
    }

    const {
        control,
        register,
        reset,
        handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm<TrainingEntryFieldValues>({
        defaultValues: defaultValues,
    })
    const {fields, append, remove} = useFieldArray({
        control: control,
        name: "series",
        rules: {
            required: {
                value: true,
                message: "Es muss mindestens eine Serie angegeben werden",
            },
        }
    })

    const onSubmit = async (data: TrainingEntryFieldValues) => {
        const series = data.series
            .map(series => series.score)
            .filter(isNumber)

        const startDate = new Date(data.date)
        setTimeOfDate(startDate, data.startTime)

        const endDate = new Date(data.date)
        setTimeOfDate(endDate, data.endTime)

        if (startDate > endDate) {
            // end date is on the next day
            endDate.setTime(endDate.getTime() + 24 * 60 * 60 * 1000)
        }

        await addTrainingEntry({
            discipline: data.discipline,
            startDate,
            endDate,
            notes: data.notes,
            series: series,
        })

        reset(defaultValues)
        toast.success("Trainingseintrag wurde erfolgreich hinzugefügt!")
    }

    return (
        <div className="flex flex-col items-stretch">
            <h1 className="self-center text-3xl text-primary my-4 uppercase">Trainingsdoku</h1>

            <div className="divider uppercase">Neue Session</div>

            <form className="m-4 flex flex-col items-stretch gap-2" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-control">
                    <label className="label"><span className="label-text text-xl">Disziplin</span></label>
                    <select className="select select-bordered" {...register("discipline", {required: true})}>
                        <option value={Disciplines.AirRifle}>{disciplineNames[Disciplines.AirRifle]}</option>
                        <option value={Disciplines.Pistol}>{disciplineNames[Disciplines.Pistol]}</option>
                    </select>
                    {errors.discipline && <span className="text-error">Dieses Feld ist erforderlich</span>}
                </div>

                <div className="form-control">
                    <label className="label"><span className="label-text text-xl">Datum</span></label>
                    <input className="input input-bordered" {...register("date", {
                        required: true,
                        valueAsDate: true
                    })}
                           type="date"/>
                    {errors.date && <span className="text-error">Dieses Feld ist erforderlich</span>}
                </div>

                <div className="flex flex-row gap-8">
                    <div className="form-control">
                        <label className="label"><span className="label-text text-xl">Startzeit</span></label>
                        <input className="input input-bordered" {...register("startTime", {required: true})}
                               type="time"/>
                        {errors.startTime && <span className="text-error">Dieses Feld ist erforderlich</span>}
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text text-xl">Endzeit</span></label>
                        <input className="input input-bordered" {...register("endTime", {required: true})} type="time"/>
                        {errors.endTime && <span className="text-error">Dieses Feld ist erforderlich</span>}
                    </div>
                </div>

                <div className="form-control w-full">
                    <label className="label"><span className="label-text text-xl">Serien</span></label>
                    <div className="w-full grid grid-cols-3 gap-8">
                        {fields.map((field, index) =>
                            <div key={field.id} className="flex flex-col">
                                <div className="mb-2 indicator">
                                    <button className="indicator-item bg-base-200 hover:bg-base-300 mask mask-circle w-6 min-h-2 h-6 flex items-center justify-center"
                                            type="button" onClick={() => remove(index)}>
                                        <FontAwesomeIcon icon={faXmark} className="" />
                                    </button>
                                    <input className="input input-bordered w-24"
                                           type="number" step="0.1" {...register(`series.${index}`, {
                                        valueAsNumber: true,
                                        min: 0,
                                        required: true,
                                    })} />
                                </div>
                            </div>
                        )}
                    </div>
                    {errors.series?.root &&
                        <span className="text-error">{errors.series.root.message}</span>}
                </div>
                <button className="btn btn-outline mb-2" type="button" onClick={() => append({score: null})}>
                    Serie hinzufügen
                </button>

                <div className="form-control">
                    <label className="label"><span className="label-text text-xl">Notizen</span></label>
                    <textarea className="textarea textarea-bordered" {...register("notes", {required: false})} />
                </div>

                <button className="btn btn-secondary" type="submit" disabled={isSubmitting}>Speichern</button>
            </form>
        </div>
    );
}

export default AddTrainingEntryForm;
