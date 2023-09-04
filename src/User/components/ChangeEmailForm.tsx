import React from 'react';
import UserModel from "../models/User.model";
import {auth} from "../../shared/utils/firebase";
import {useForm} from "react-hook-form";
import useEffectWithPrevious from "../../shared/hooks/effectWithPrevious";
import {toast} from "react-toastify";
import useChangeEmailAddress from "../../Auth/hooks/changeEmailAddress";

interface EmailFieldValues {
    password: string,
    email: string,
}

interface Props {
    user: UserModel
}

function ChangeEmailForm({user}: Props) {
    const [changeEmail, changeEmailLoading, changeEmailError] = useChangeEmailAddress(auth, user.id)

    const {register, handleSubmit, formState: {errors}} = useForm<EmailFieldValues>();

    useEffectWithPrevious(([prevChangeEmailLoading]) => {
        if (changeEmailLoading !== prevChangeEmailLoading && !changeEmailLoading) {
            if (changeEmailError) {
                toast.error(changeEmailError.message)
            } else {
                toast.success(`Email wurde erfolgreich geändert!`)
            }
        }
    }, [changeEmailLoading, changeEmailError])

    const onSubmit = async (data: EmailFieldValues) => {
        await changeEmail(data.password, data.email)
    }

    return (
        <form className="flex flex-col items-stretch gap-2" onSubmit={handleSubmit(onSubmit)}>
            <input className="input input-bordered" type="password"
                   placeholder="Passwort" {...register("password", {required: true})}/>
            {errors.password &&
                <label className={"label"}><span
                    className={"label-text-alt text-error"}>Password is required</span></label>}
            <div className="join">
                <input className="input input-bordered join-item"
                       placeholder="Email" {...register("email", {required: true})}/>
                <button className="btn join-item" type="submit" disabled={changeEmailLoading}>Email ändern</button>
            </div>
            {errors.email &&
                <label className={"label"}><span
                    className={"label-text-alt text-error"}>Email is required</span></label>}
        </form>
    );
}

export default ChangeEmailForm;
