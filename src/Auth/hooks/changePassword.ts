import {useState} from 'react';
import {Auth, EmailAuthProvider, reauthenticateWithCredential, updatePassword} from "firebase/auth";

type ChangePasswordHook = [
    (oldPassword: string, newPassword: string) => void,
    boolean,
        Error | null
]

function useChangePassword(auth: Auth): ChangePasswordHook {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const changePassword = async (oldPassword: string, newPassword: string) => {
        try {
            setLoading(true)
            setError(null)

            const userCredential = EmailAuthProvider.credential(auth.currentUser!.email!, oldPassword)
            await reauthenticateWithCredential(auth.currentUser!, userCredential)

            await updatePassword(auth.currentUser!, newPassword)

            setLoading(false)
        } catch (e) {
            setLoading(false)
            if (e instanceof Error) {
                setError(e)
            }
        }
    }

    return [changePassword, loading, error]
}

export default useChangePassword;
