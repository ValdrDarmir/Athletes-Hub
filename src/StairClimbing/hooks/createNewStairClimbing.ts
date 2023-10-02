import {useState} from "react";
import {doc, setDoc} from "firebase/firestore";
import * as uuid from "uuid"
import UserModel from "../../User/models/User.model";
import db from "../../shared/utils/db";
import StairClimbingModel from "../models/StairClimbing.model";
import {getRandomStepGoals} from "../models/StepGoals";
import Disciplines from "../../User/models/Disciplines";

export type CreateNewStairClimbingHook = [
    (creator: UserModel, discipline: Disciplines, stepGoalAmount: number) => Promise<StairClimbingModel>,
    boolean,
        Error | null,
]

function useCreateNewStairClimbing(): CreateNewStairClimbingHook {
    const [creationLoading, setCreationLoading] = useState(false)
    const [creationError, setCreationError] = useState<Error | null>(null)

    const createNewGame = async (creator: UserModel, discipline: Disciplines, stepGoalAmount: number) => {

        setCreationLoading(true)
        setCreationError(null)

        const randomStepGoals = getRandomStepGoals(discipline, stepGoalAmount)

        const newGameDoc = doc(db.stairClimbing, uuid.v4())

        const newGameData: StairClimbingModel = {
            id: newGameDoc.id,
            playerIds: [],
            creatorId: creator.id,
            shootingTimeLimitMillis: 15 * 60 * 1000,    // 15 minutes
            startTimeMillis: null,
            discipline: discipline,
            playerSteps: [],
            stepGoals: randomStepGoals,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        await setDoc(newGameDoc, newGameData)

        setCreationLoading(false)

        return newGameData;
    }

    return [createNewGame, creationLoading, creationError]
}

export default useCreateNewStairClimbing
