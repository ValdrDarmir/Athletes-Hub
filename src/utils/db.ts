import {firestore} from "./firebase";
import "firebase/firestore"
import { collection, FirestoreDataConverter } from "firebase/firestore";

const defaultConverter = <T>(): FirestoreDataConverter<T> => ({
    toFirestore: (data) => data || {},
    fromFirestore: (snap) => snap.data() as T
})

const dataPoint = <T>(collectionPath: string, converter: FirestoreDataConverter<T>) => collection(firestore, collectionPath).withConverter(converter)

const db = {
    // users: dataPoint<YourType>('users', defaultConverter())
    tests: dataPoint<{name: string}>("tests", defaultConverter())
}

export default db
