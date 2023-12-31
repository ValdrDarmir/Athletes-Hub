import React from "react";
import {useForm} from "react-hook-form";
import {useSignInWithEmailAndPassword} from "react-firebase-hooks/auth";
import {Link} from "react-router-dom";
import gewehrMann from "../assets/gewehr_mann.png"
import { auth } from "../../shared/utils/firebase";
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import {routes} from "../../routes";

interface LoginFieldValues {
    email: string,
    password: string
}

function Login() {
    const {register, handleSubmit, formState: {errors}} = useForm<LoginFieldValues>();
    const [signInWithEmailAndPassword, , signInLoading, signinError] = useSignInWithEmailAndPassword(auth)

    const onSubmit = (data: LoginFieldValues) => {
        void signInWithEmailAndPassword(data.email, data.password)
    }

    return <div>
        <div className="hero h-64 bg-cover" style={{backgroundImage: `url(${gewehrMann})`}}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content m-10 text-center text-neutral-content flex-col">
                <h1 className="text-5xl font-bold">Login</h1>
            </div>
        </div>
        <form className="card-body flex-col " onSubmit={handleSubmit(onSubmit)}>
            <div className={"form-control"}>
                <label className="label"><span className="label-text text-xl">Email</span></label>
                <input className={"input input-bordered"} {...register("email", {required: true})}/>
                {errors.email &&
									<label className={"label"}><span className={"label-text-alt text-error"}>Email is required and must be valid</span></label>}

            </div>

            <div className={"form-control"}>
                <label className="label"><span className="label-text text-xl">Password</span></label>
                <input className={"input input-bordered"} type="password" {...register("password", {required: true})}/>
                {errors.password && <label className={"label"}><span className={"label-text-alt text-error"}>Password is required</span></label>}
            </div>

            {/*<Link to={"#"} className="link text-right">Passwort vergessen?</Link>*/}

            {signinError && <ErrorDisplay error={signinError}/>}

            <button className={"btn btn-neutral btn-primary w-full"} type={"submit"} disabled={signInLoading}>Login</button>

            <div className="divider">oder</div>

            <Link to={routes.register.path} className="btn btn-neutral w-full">Account erstellen</Link>
        </form>
    </div>
}

export default Login
