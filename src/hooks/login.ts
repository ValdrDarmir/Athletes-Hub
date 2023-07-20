import {
    useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import {auth} from "../utils/firebase";
import {updateDoc, doc} from "firebase/firestore"
import db from "../utils/db";
import {useEffect} from "react";
import {useDocumentData} from "react-firebase-hooks/firestore";

const useLogin = () => {
    const [signInWithEmailAndPassword, authUser, signInLoading, signInError] = useSignInWithEmailAndPassword(auth)
    const [dbUser, dbLoading, dbError] = useDocumentData(authUser ? doc(db.users, authUser.user.uid) : null)


    const loading = signInLoading || dbLoading
    const error = signInError || dbError


    useEffect(() => {
        // useEffect does not allow async functions. This is how they still work
        const updateUser = async () => {
            if (authUser) {
                // in theory email can be changed externally. This should be reflected in our database (that's why we update it on login)
                const userDoc = doc(db.users, authUser.user.uid)
                await updateDoc(userDoc, {
                    displayName: authUser.user.displayName,
                    email: authUser.user.email,
                })
            }

        }

        void updateUser()
    }, [authUser])

    return [signInWithEmailAndPassword, dbUser, loading, error] as const
}

export default useLogin
