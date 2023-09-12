import TrainingEntryModel from "../models/TrainingEntry.model";
import db from "../../shared/utils/db";
import {doc, query, setDoc} from "firebase/firestore";
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
}


function useTrainingEntries(userId: string): TrainingEntriesHook {
    const [trainingEntries, trainingEntriesLoading, trainingEntriesError] = useCollectionData(
        query(db.training,
            whereTyped<TrainingEntryModel>("userId", "==", userId)
        )
    )

    const trainingEntriesSorted = trainingEntries && trainingEntries.sort((a, b) => {
        return a.startDate.getTime() - b.startDate.getTime()
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

    return {
        trainingEntries: trainingEntriesSorted,
        loading: trainingEntriesLoading,
        error: trainingEntriesError || null,
        addTrainingEntry: addTrainingEntry,
    }
}

export default useTrainingEntries
