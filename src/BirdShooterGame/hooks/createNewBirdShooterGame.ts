import {useState} from "react";
import {doc, setDoc} from "firebase/firestore";
import * as uuid from "uuid"
import UserModel from "../../User/models/User.model";
import db from "../../shared/utils/db";
import Disciplines from "../../User/models/Disciplines";
import BirdShooterGameModel from "../models/BirdShooterGame.model";

function useCreateNewBirdShooterGame() {
    const [creationLoading, setCreationLoading] = useState(false)
    const [creationError, setCreationError] = useState<Error | null>(null)

    const createNewGame = async (creator: UserModel, discipline: Disciplines) => {

        setCreationLoading(true)
        setCreationError(null)

        const newGameDoc = doc(db.gameBirdShooter, uuid.v4())

        const newGameData: BirdShooterGameModel = {
            id: newGameDoc.id,
            rounds: 5,
            participants: [],
            series: [],
            creatorId: creator.id,
            discipline: discipline,
            gameRunning: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        await setDoc(newGameDoc, newGameData)

        setCreationLoading(false)

        return newGameData;
    }

    return [createNewGame, creationLoading, creationError] as const
}

export default useCreateNewBirdShooterGame
