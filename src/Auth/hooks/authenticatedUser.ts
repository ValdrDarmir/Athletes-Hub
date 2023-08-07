import {useAuthState} from "react-firebase-hooks/auth";
import {doc} from "firebase/firestore";
import {useDocumentData} from "react-firebase-hooks/firestore";
import { auth } from "../../shared/utils/firebase";
import db from "../../shared/utils/db";

function useAuthenticatedUser() {
    const [authUser, authLoading, authError] = useAuthState(auth)
    const [dbUser, dbLoading, dbError] = useDocumentData(authUser ? doc(db.users, authUser.uid) : null)

    const noDbUserError = authUser && !dbUser && new Error("User not found in database")

    const loading = authLoading || dbLoading
    const error = authError || dbError || noDbUserError

    return [dbUser, loading, error] as const
}

export default useAuthenticatedUser
