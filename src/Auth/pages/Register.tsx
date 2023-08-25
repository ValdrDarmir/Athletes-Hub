import React from "react";
import {useForm} from "react-hook-form";
import {Link} from "react-router-dom";
import useCreateUser from "../hooks/createUser";
import gewehrMann from "../assets/gewehr_mann.png"
import ErrorDisplay from "../../shared/components/ErrorDisplay";

interface RegisterFieldValues {
    username: string,
    email: string,
    password: string
}

function Register() {
    const {register, handleSubmit, formState: {errors}} = useForm<RegisterFieldValues>();
    const [createUser, createUserLoading, createUserError] = useCreateUser()

    const onSubmit = async (data: RegisterFieldValues) => {
        void createUser(data)
    }

    return <div>
        <div className="hero h-64 bg-cover" style={{backgroundImage: `url(${gewehrMann})`}}>
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
                {errors.password &&
                    <label className={"label"}><span className={"label-text-alt text-error"}>Password is required</span></label>}
            </div>

            {createUserError && <ErrorDisplay error={createUserError}/>}

            <button className={"btn btn-primary w-full mt-5"} type={"submit"} disabled={createUserLoading}>
                Account erstellen
            </button>

            <div className="divider">oder</div>

            <Link to={"/login"} className="btn w-full">Einloggen</Link>
        </form>
    </div>
}

export default Register
