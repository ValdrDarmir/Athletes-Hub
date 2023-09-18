import {useState} from "react";
import {doc, setDoc} from "firebase/firestore";
import * as uuid from "uuid"
import UserModel from "../../User/models/User.model";
import db from "../../shared/utils/db";
import Disciplines from "../../User/models/Disciplines";
import CompetitionModel from "../models/CompetitionModel";

function useCreateNewCompetition() {
    const [creationLoading, setCreationLoading] = useState(false)
    const [creationError, setCreationError] = useState<Error | null>(null)

    const createNewGame = async (creator: UserModel, discipline: Disciplines) => {

        setCreationLoading(true)
        setCreationError(null)

        const newGameDoc = doc(db.competition, uuid.v4())

        const newGameData: CompetitionModel = {
            id: newGameDoc.id,
            participantIds: [],
            participantSeries: [],
            creatorId: creator.id,
            seriesCount: 4,                             // == 40 shots
            shootingTimeLimitMillis: 15 * 60 * 1000,    // 15 minutes
            startTimeMillis: null,
            discipline: discipline,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        await setDoc(newGameDoc, newGameData)

        setCreationLoading(false)

        return newGameData;
    }

    return [createNewGame, creationLoading, creationError] as const
}

export default useCreateNewCompetition
