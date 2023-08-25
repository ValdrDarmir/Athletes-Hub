import {useState} from 'react';
import {doc, setDoc} from "firebase/firestore";
import db from "../../shared/utils/db";
import {Auth, updateProfile} from "firebase/auth";

type ChangeUsernameHook = [
    (newUsername: string) => void,
    boolean,
        Error | null
]

function useChangeUsername(auth: Auth, userId: string): ChangeUsernameHook {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const changeUsername = async (newUsername: string) => {
        try {
            setLoading(true)
            setError(null)

            const userDoc = doc(db.users, userId)
            await updateProfile(auth.currentUser!, {displayName: newUsername})
            await setDoc(userDoc, {displayName: newUsername}, {merge: true})
            setLoading(false)

            // toast.success(`Nutzername geändert! Hallo ${newUsername}!`)
        } catch (e) {
            setLoading(false)
            if (e instanceof Error) {
                setError(e)
            }
        }
    }

    return [changeUsername, loading, error]
}

export default useChangeUsername;
