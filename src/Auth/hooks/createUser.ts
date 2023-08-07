import {useCreateUserWithEmailAndPassword, useUpdateProfile} from "react-firebase-hooks/auth";
import {setDoc, doc} from "firebase/firestore"
import { auth } from "../../shared/utils/firebase";
import db from "../../shared/utils/db";

interface CreateUserData {
    email: string
    password: string
    username: string
}

const useCreateUser = () => {
    const [createUserWithEmailAndPassword, , signUpLoading, signUpError] = useCreateUserWithEmailAndPassword(auth)
    const [updateProfile, updateProfileLoading, updateProfileError] = useUpdateProfile(auth)

    const loading = signUpLoading || updateProfileLoading
    const error = signUpError || updateProfileError

    const createUser = async (data: CreateUserData) => {
        const user = await createUserWithEmailAndPassword(data.email, data.password)
        if (!user) return Error("user was undefined during creation!?");

        await updateProfile({
            displayName: data.username,
        })

        const newDoc = doc(db.users, user.user.uid)

        await setDoc(newDoc, {
            id: user.user.uid,
            displayName: data.username,
            email: user.user.email,
        })
    }

    return [createUser, loading, error] as const
}

export default useCreateUser