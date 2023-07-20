import {firestore} from "./firebase";
import "firebase/firestore"
import { collection, FirestoreDataConverter } from "firebase/firestore";
import User from "../models/User";
import GameBirdShooter from "../models/GameBirdShooter";

const dumpConverter = <T>(): FirestoreDataConverter<T> => ({
    toFirestore: (data) => data || {},
    fromFirestore: (snap) => snap.data() as T
})

const dataPoint = <T>(collectionPath: string, converter: FirestoreDataConverter<T>) => collection(firestore, collectionPath).withConverter(converter)

const db = {
    tests: dataPoint<{name: string}>("tests", dumpConverter()),
    users: dataPoint<User>("users", dumpConverter()),
    gameBirdShooter: dataPoint<GameBirdShooter>("gameBirdShooter", dumpConverter())
}

export default db
