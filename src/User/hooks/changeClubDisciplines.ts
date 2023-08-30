import {deleteDoc, doc, setDoc} from "firebase/firestore";
import db from "../../shared/utils/db";
import * as uuid from "uuid"
import ClubDiscipline from "../models/ClubDiscipline";
import Disciplines from "../models/Disciplines";


function useChangeClubDisciplines(userId: string) {

    const addClubDiscipline = async (clubDiscipline: {club: string, discipline: Disciplines}) => {
        const newDocRef = doc(db.clubDisciplines, uuid.v4())
        await setDoc(newDocRef, {
            id: newDocRef.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: userId,
            club: clubDiscipline.club,
            discipline: clubDiscipline.discipline
        })
    }

    const removeClubDiscipline = async (clubDisciplineId: string) => {
        const docRef = doc(db.clubDisciplines, clubDisciplineId)
        await deleteDoc(docRef)
    }


    const updateClubDiscipline = async (clubDiscipline: ClubDiscipline) => {
        const newDocRef = doc(db.clubDisciplines, clubDiscipline.id)
        await setDoc(newDocRef, {
            club: clubDiscipline.club,
            discipline: clubDiscipline.discipline
        }, {merge: true})
    }

    return {addClubDiscipline, removeClubDiscipline, updateClubDiscipline}
}

export default useChangeClubDisciplines;
