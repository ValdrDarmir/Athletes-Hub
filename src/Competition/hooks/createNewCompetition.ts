import {useState} from "react";
import {doc, setDoc} from "firebase/firestore";
import * as uuid from "uuid"
import UserModel from "../../User/models/User.model";
import db from "../../shared/utils/db";
import Disciplines from "../../User/models/Disciplines";
import CompetitionModel from "../models/Competition.model";

function useCreateNewCompetition() {
    const [creationLoading, setCreationLoading] = useState(false)
    const [creationError, setCreationError] = useState<Error | null>(null)

    const createNewCompetition = async (creator: UserModel, discipline: Disciplines) => {

        setCreationLoading(true)
        setCreationError(null)

        const newCompetitionDoc = doc(db.competition, uuid.v4())

        const newCompetitionData: CompetitionModel = {
            id: newCompetitionDoc.id,
            participantIds: [],
            participantSeries: [],
            creatorId: creator.id,
            seriesCount: 4,                             // == 40 shots
            shootingTimeLimitMillis: 50 * 60 * 1000,    // 50 minutes
            startTimeMillis: null,
            discipline: discipline,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        await setDoc(newCompetitionDoc, newCompetitionData)

        setCreationLoading(false)

        return newCompetitionData;
    }

    return [createNewCompetition, creationLoading, creationError] as const
}

export default useCreateNewCompetition
