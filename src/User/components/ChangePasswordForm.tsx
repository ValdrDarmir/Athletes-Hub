import React from 'react';
import {auth} from "../../shared/utils/firebase";
import {useForm} from "react-hook-form";
import useEffectWithPrevious from "../../shared/hooks/effectWithPrevious";
import {toast} from "react-toastify";
import useChangePassword from "../../Auth/hooks/changePassword";

interface PasswordFieldValues {
    oldPassword: string,
    newPassword: string,
}

function ChangePasswordForm() {
    const [changePassword, changePasswordLoading, changePasswordError] = useChangePassword(auth)

    const {register, handleSubmit, formState: {errors}} = useForm<PasswordFieldValues>();

    useEffectWithPrevious(([prevChangePasswordLoading]) => {
        if (changePasswordLoading !== prevChangePasswordLoading && !changePasswordLoading) {
            if (changePasswordError) {
                toast.error(changePasswordError.message)
            } else {
                toast.success(`Passwort wurde erfolgreich geändert!`)
            }
        }
    }, [changePasswordLoading, changePasswordError])

    const onSubmit = async (data: PasswordFieldValues) => {
        changePassword(data.oldPassword, data.newPassword)
    }

    return (
        <form className="flex flex-col items-stretch gap-2" onSubmit={handleSubmit(onSubmit)}>
            <input className="input input-bordered" type="password"
                   placeholder="Altes Passwort" {...register("oldPassword", {required: true})}/>
            {errors.oldPassword &&
                <label className={"label"}><span
                    className={"label-text-alt text-error"}>Password is required</span></label>}
            <div className="join">
                <input className="input input-bordered join-item" type="password"
                       placeholder="Neues Passwort" {...register("newPassword", {required: true})}/>
                <button className="btn btn-neutral join-item" type="submit" disabled={changePasswordLoading}>Passwort ändern
                </button>
            </div>
            {errors.newPassword &&
                <label className={"label"}><span
                    className={"label-text-alt text-error"}>Password is required</span></label>}
        </form>
    );
}

export default ChangePasswordForm;
