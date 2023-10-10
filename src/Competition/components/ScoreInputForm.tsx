import React from 'react';
import {useForm} from "react-hook-form";

interface Props {
    onSubmit(values: ScoreFormFieldsValues): void
}


export interface ScoreFormFieldsValues {
    score: number
}

function ScoreInputForm({onSubmit}: Props) {
    const {register, handleSubmit} = useForm<ScoreFormFieldsValues>()

    return (
        <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
                <label className="label"><span className="label-text">Serien Punkte</span></label>
                <input className="input input-bordered" type="number" step="0.1" {...register("score", {
                    min: 0,
                    valueAsNumber: true
                })}/>
            </div>
            <button className="btn btn-primary" type="submit">Serie eintragen</button>
        </form>
    );
}

export default ScoreInputForm;
