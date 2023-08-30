import {setDoc, doc} from "firebase/firestore"
import {auth} from "../../shared/utils/firebase";
import db from "../../shared/utils/db";
import {useState} from "react";
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";

interface CreateUserData {
    email: string
    password: string
    username: string
}

type CreateUserHook = [
    (data: CreateUserData) => Promise<void> | null,
    boolean,
        Error | null,
]

const useCreateUser = (): CreateUserHook => {
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const createUser = async (data: CreateUserData): Promise<void> => {
        try {
            setLoading(true)
            setError(null)

            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
            await updateProfile(userCredential.user, {
                displayName: data.username,
            })

            const newDoc = doc(db.users, userCredential.user.uid)

            await setDoc(newDoc, {
                id: userCredential.user.uid,
                displayName: data.username,
                email: data.email,
                createdAt: new Date(),
                updatedAt: new Date(),
            })

            setLoading(false)
        } catch (error) {
            if(error instanceof Error) {
                setError(error)
            }
            setLoading(false)
        }
    }

    return [createUser, loading, error]
}

export default useCreateUser