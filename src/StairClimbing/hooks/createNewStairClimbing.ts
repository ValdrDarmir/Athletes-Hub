import {useState} from "react";
import {doc, setDoc} from "firebase/firestore";
import * as uuid from "uuid"
import UserModel from "../../User/models/User.model";
import db from "../../shared/utils/db";
import StairClimbingModel from "../models/StairClimbing.model";
import {getRandomStepGoals} from "../models/StepGoals";

function useCreateNewStairClimbing() {
    const [creationLoading, setCreationLoading] = useState(false)
    const [creationError, setCreationError] = useState<Error | null>(null)

    const createNewGame = async (creator: UserModel) => {

        setCreationLoading(true)
        setCreationError(null)

        // TODO: change fixed amount of goals
        const randomStepGoals = getRandomStepGoals(5)

        const newGameDoc = doc(db.stairClimbing, uuid.v4())

        const newGameData: StairClimbingModel = {
            id: newGameDoc.id,
            participantIds: [],
            creatorId: creator.id,
            shootingTimeLimitMillis: 15 * 60 * 1000,    // 15 minutes
            startTimeMillis: null,
            participantSteps: [],
            stepGoals: randomStepGoals,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        await setDoc(newGameDoc, newGameData)

        setCreationLoading(false)

        return newGameData;
    }

    return [createNewGame, creationLoading, creationError] as const
}

export default useCreateNewStairClimbing
