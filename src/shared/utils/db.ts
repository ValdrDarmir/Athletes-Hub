import {firestore} from "./firebase";
import "firebase/firestore"
import {collection, DocumentData, FirestoreDataConverter} from "firebase/firestore";
import User from "../../User/models/User";
import BirdShooterGame from "../../BirdShooterGame/models/BirdShooterGame";
import BaseDBModel from "../models/BaseDBModel";

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
        // You could check every incoming value here, if a value is missing.
        // We convert firestore timestamps to js dates here.
        return {
            ...snap.data(),
            createdAt: snap.data().createdAt.toDate(),
            updatedAt: snap.data().updatedAt.toDate(),
        } as T
    }
})

const dataPoint = <T extends DocumentData>(collectionPath: string, converter: FirestoreDataConverter<T, T>) => collection(firestore, collectionPath).withConverter(converter)

const db = {
    users: dataPoint<User>("users", dumpConverter<User>()),
    gameBirdShooter: dataPoint<BirdShooterGame>("gameBirdShooter", dumpConverter<BirdShooterGame>())
}

export default db
