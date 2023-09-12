import {firestore} from "./firebase";
import "firebase/firestore"
import {collection, DocumentData, FirestoreDataConverter} from "firebase/firestore";
import UserModel from "../../User/models/User.model";
import BirdShooterGameModel from "../../BirdShooterGame/models/BirdShooterGame.model";
import BaseDBModel from "../models/BaseDB.model";
import ClubDisciplineModel from "../../User/models/ClubDiscipline.model";
import TrainingEntryModel from "../../Training/models/TrainingEntry.model";

const dumpConverter = <T extends BaseDBModel>(): FirestoreDataConverter<T, T> => ({
    toFirestore: (data) => {
        // You could check every outgoing value here.
        // We add the updatedAt field here.
        return {
            ...data,
            updatedAt: new Date()
        } as T
    },
    fromFirestore: (snap) => {
        const data = snap.data()
        // You could check every incoming value here, if a value is missing.
        // We convert all firestore timestamps to js dates here.
        const convertedDates: Record<string, Date> = {}
        Object.keys(data).forEach(key => {
                if (data[key].toDate) {
                    convertedDates[key] = data[key].toDate()
                }
            }
        )

        return {
            ...data,
            ...convertedDates,
        } as T
    }
})

const dataPoint = <T extends DocumentData>(collectionPath: string, converter: FirestoreDataConverter<T, T>) => collection(firestore, collectionPath).withConverter(converter)

const db = {
    users: dataPoint<UserModel>("users", dumpConverter<UserModel>()),
    clubDisciplines: dataPoint<ClubDisciplineModel>("clubDisciplines", dumpConverter<ClubDisciplineModel>()),
    gameBirdShooter: dataPoint<BirdShooterGameModel>("gameBirdShooter", dumpConverter<BirdShooterGameModel>()),
    training: dataPoint<TrainingEntryModel>("training", dumpConverter<TrainingEntryModel>()),
}

export default db
