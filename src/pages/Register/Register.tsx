import React from "react";
import {useForm} from "react-hook-form";
import {auth} from "../../utils/firebase";
import {
    useCreateUserWithEmailAndPassword,
    useUpdateProfile
} from "react-firebase-hooks/auth";
import {Link} from "react-router-dom";

interface RegisterFieldValues {
    username: string,
    email: string,
    password: string
}

function Register() {
    const {register, handleSubmit, formState: {errors}} = useForm<RegisterFieldValues>();
    const [createUserWithEmailAndPassword, , signUpLoading, signUpError] = useCreateUserWithEmailAndPassword(auth)
    const [updateProfile, updateProfileLoading, updateProfileError] = useUpdateProfile(auth)

    const onSubmit = async (data: RegisterFieldValues) => {
        const user = await createUserWithEmailAndPassword(data.email, data.password)
        if (user) {
            void updateProfile({
                displayName: data.username,
            })
        }
    }

    return <div>
        <div className="hero h-64 bg-cover" style={{backgroundImage: 'url(/assets/gewehr_mann.png)'}}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content m-10 text-center text-neutral-content flex-col">
                <h1 className="text-5xl font-bold">Account erstellen</h1>
                <p>Sei bei der Party dabei.</p>
            </div>
        </div>
        <form className="card-body flex-col " onSubmit={handleSubmit(onSubmit)}>
            <div className={"form-control"}>
                <label className="label"><span className="label-text">Username</span></label>
                <input className={"input input-bordered"} {...register("username", {required: true})}/>
                {errors.username &&
									<label className={"label"}><span className={"label-text-alt text-error"}>Username is required and must be valid</span></label>}

            </div>

            <div className={"form-control"}>
                <label className="label"><span className="label-text">Email</span></label>
                <input className={"input input-bordered"} {...register("email", {required: true})}/>
                {errors.email &&
									<label className={"label"}><span className={"label-text-alt text-error"}>Email is required and must be valid</span></label>}
            </div>

            <div className={"form-control"}>
                <label className="label"><span className="label-text">Password</span></label>
                <input className={"input input-bordered"} type="password" {...register("password", {required: true})}/>
                {errors.password && <label className={"label"}><span className={"label-text-alt text-error"}>Password is required</span></label>}
            </div>

            {signUpError && <p className={"text-error"}>{signUpError.message}</p>}
            {updateProfileError && <p className={"text-error"}>{updateProfileError.message}</p>}

            <button className={"btn btn-primary w-full mt-5"} type={"submit"}
                    disabled={signUpLoading || updateProfileLoading}>Account erstellen
            </button>

            <div className="divider">oder</div>

            <Link to={"/login"} className="btn w-full">Einloggen</Link>
        </form>
    </div>
}

export default Register
