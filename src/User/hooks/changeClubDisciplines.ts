import {arrayRemove, arrayUnion, doc, setDoc} from "firebase/firestore";
import db from "../../shared/utils/db";
import {ClubDiscipline} from "../models/User";

function useChangeClubDisciplines(userId: string) {

    const addClubDiscipline = async (clubDiscipline: ClubDiscipline) => {
        const docRef = doc(db.users, userId)
        await setDoc(docRef, {
            disciplines: arrayUnion(clubDiscipline)
        }, {merge: true})
    }

    const removeClubDiscipline = async (clubDiscipline: ClubDiscipline) => {
        const docRef = doc(db.users, userId)
        await setDoc(docRef, {
            disciplines: arrayRemove(clubDiscipline)
        }, {merge: true})

    }

    return {addClubDiscipline, removeClubDiscipline} as const
}

export default useChangeClubDisciplines;
