import {firestore} from "./firebase";
import "firebase/firestore"
import { collection, DocumentData, FirestoreDataConverter } from "firebase/firestore";
import User from "../models/User";
import GameBirdShooter from "../models/GameBirdShooter";

const dumpConverter = <T extends DocumentData>(): FirestoreDataConverter<T, T> => ({
    toFirestore: (data) => {
        // This is hacky. Normally you would check every outgoing value here.
        return data as T
    },
    fromFirestore: (snap) => {
        // This is hacky. Normally you would check every incoming value here.
        return snap.data() as T
    }
})

const dataPoint = <T extends DocumentData>(collectionPath: string, converter: FirestoreDataConverter<T, T>) => collection(firestore, collectionPath).withConverter(converter)

const db = {
    users: dataPoint<User>("users", dumpConverter<User>()),
    gameBirdShooter: dataPoint<GameBirdShooter>("gameBirdShooter", dumpConverter<GameBirdShooter>())
}

export default db
