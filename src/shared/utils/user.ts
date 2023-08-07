import {limit, query, where, getDocs} from "firebase/firestore";
import db from "./db";

export async function getUserById(uid: string) {
    const userQuery = query(db.users, where("id", "==", uid), limit(1))
    const queryResult = await getDocs(userQuery)

    if(queryResult.empty){
        return null
    }

    return queryResult.docs[0].data()
}