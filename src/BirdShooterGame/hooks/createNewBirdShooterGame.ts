import {useState} from "react";
import {doc, DocumentReference, setDoc} from "firebase/firestore";
import BirdShooterGame from "../models/BirdShooterGame";
import * as uuid from "uuid"
import User from "../../App/models/User";
import db from "../../shared/utils/db";

function useCreateNewBirdShooterGame() {
    const [creationLoading, setCreationLoading] = useState(false)
    const [createdGameDoc, setCreatedGameDoc] = useState<DocumentReference<BirdShooterGame> | null>(null)

    const createNewGame = async (creator: User) => {

        setCreationLoading(true)

        const newGameDoc = doc(db.gameBirdShooter, uuid.v4())

        await setDoc(newGameDoc, {
            id: newGameDoc.id,
            rounds: 5,
            playerIds: [creator.id],
            hits: [],
            creatorId: creator.id,
            gameRunning: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        setCreatedGameDoc(newGameDoc)

        setCreationLoading(false)
    }

    return [createNewGame, createdGameDoc, creationLoading] as const
}

export default useCreateNewBirdShooterGame
