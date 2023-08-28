import React from 'react';
import User from "../../User/models/User";
import useChangeUsername from "../../Auth/hooks/changeUsername";
import {auth} from "../../shared/utils/firebase";
import {useForm} from "react-hook-form";
import useEffectWithPrevious from "../../shared/hooks/effectWithPrevious";
import {toast} from "react-toastify";

interface UsernameFieldValues {
    username: string,
}

interface Props {
    user: User
}

function ChangeUsernameForm({user}: Props) {
    const [changeUsername, changeUsernameLoading, changeUsernameError] = useChangeUsername(auth, user.id)

    const {register, handleSubmit, formState: {errors}} = useForm<UsernameFieldValues>();

    useEffectWithPrevious(([prevChangeUsernameLoading]) => {
        if (changeUsernameLoading !== prevChangeUsernameLoading && !changeUsernameLoading) {
            if (changeUsernameError) {
                toast.error(changeUsernameError.message)
            } else {
                toast.success(`Nutzername geändert! Hallo ${user.displayName}!`)
            }
        }
    }, [changeUsernameLoading, changeUsernameError])

    const onSubmit = async (data: UsernameFieldValues) => {
        await changeUsername(data.username)
    }

    return (
        <form className="flex flex-col items-stretch gap-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="join">
                <input className="input input-bordered join-item"
                       placeholder="Nutzername" {...register("username", {required: true})}/>
                <button className="btn join-item" type="submit" disabled={changeUsernameLoading}>Namen ändern</button>
            </div>
            {errors.username &&
                <label className={"label"}><span
                    className={"label-text-alt text-error"}>Username is required</span></label>}
        </form>
    );
}

export default ChangeUsernameForm;
