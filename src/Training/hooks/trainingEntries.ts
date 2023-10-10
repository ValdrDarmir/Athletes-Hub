import TrainingEntryModel from "../models/TrainingEntry.model";
import db from "../../shared/utils/db";
import {deleteDoc, doc, query, setDoc} from "firebase/firestore";
import * as uuid from "uuid";
import Disciplines from "../../User/models/Disciplines";
import {useCollectionData} from "react-firebase-hooks/firestore";
import whereTyped from "../../shared/utils/whereTyped";

interface TrainingEntryInputData {
    discipline: Disciplines
    startDate: Date
    endDate: Date
    notes: string | null
    series: number[]
}

export interface TrainingEntriesHook {
    trainingEntries: TrainingEntryModel[] | undefined
    loading: boolean,
    error: Error | null,

    addTrainingEntry(data: TrainingEntryInputData): void,
    deleteTrainingEntry(id: string): void,
}


function useTrainingEntries(userId: string): TrainingEntriesHook {
    const [trainingEntries, trainingEntriesLoading, trainingEntriesError] = useCollectionData(
        query(db.training,
            whereTyped<TrainingEntryModel>("userId", "==", userId)
        )
    )

    const trainingEntriesSorted = trainingEntries && trainingEntries.sort((a, b) => {
        return a.startDate > b.startDate ? -1 : 1
    })

    const addTrainingEntry = async (data: TrainingEntryInputData) => {
        const newDoc = doc(db.training, uuid.v4())

        return setDoc(newDoc, {
            id: newDoc.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: userId,
            discipline: data.discipline,
            startDate: data.startDate,
            endDate: data.endDate,
            notes: data.notes,
            series: data.series,
        })
    }

    const deleteTrainingEntry = async (id: string) => {
        const docRef = doc(db.training, id)
        return deleteDoc(docRef)
    }

    return {
        trainingEntries: trainingEntriesSorted,
        loading: trainingEntriesLoading,
        error: trainingEntriesError || null,
        addTrainingEntry: addTrainingEntry,
        deleteTrainingEntry: deleteTrainingEntry,
    }
}

export default useTrainingEntries
