import {useState} from 'react';
import {doc, setDoc} from "firebase/firestore";
import db from "../../shared/utils/db";
import {Auth, EmailAuthProvider, reauthenticateWithCredential, updateEmail} from "firebase/auth";

type ChangeEmailAddressHook = [
    (password: string, newEmail: string) => void,
    boolean,
        Error | null
]

function useChangeEmailAddress(auth: Auth, userId: string): ChangeEmailAddressHook {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const changeEmailAddress = async (password: string, newEmail: string) => {
        try {
            setLoading(true)
            setError(null)

            const userCredential = EmailAuthProvider.credential(auth.currentUser!.email!, password)
            await reauthenticateWithCredential(auth.currentUser!, userCredential)

            const userDoc = doc(db.users, userId)
            await updateEmail(auth.currentUser!, newEmail)
            await setDoc(userDoc, {email: newEmail}, {merge: true})

            setLoading(false)
        } catch (e) {
            setLoading(false)
            if (e instanceof Error) {
                setError(e)
            }
        }
    }

    return [changeEmailAddress, loading, error]
}

export default useChangeEmailAddress;
