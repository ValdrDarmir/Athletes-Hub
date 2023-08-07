import React from "react";
import {useForm} from "react-hook-form";
import {auth} from "../../utils/firebase";
import {useSignInWithEmailAndPassword} from "react-firebase-hooks/auth";
import {Link} from "react-router-dom";
import gewehrMann from "../../assets/gewehr_mann.png"

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
                <p>Log dich ein, dann kannst du dich ausloggen.</p>
            </div>
        </div>
        <form className="card-body flex-col " onSubmit={handleSubmit(onSubmit)}>
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

            <Link to={"#"} className="link text-right">Passwort vergessen?</Link>

            {signinError && <p className={"text-error"}>{signinError.message}</p>}

            <button className={"btn btn-primary w-full"} type={"submit"} disabled={signInLoading}>Login</button>

            <div className="divider">oder</div>

            <Link to={"/register"} className="btn w-full">Account erstellen</Link>
        </form>
    </div>
}

export default Login
