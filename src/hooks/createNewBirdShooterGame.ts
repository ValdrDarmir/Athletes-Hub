import {useState} from "react";
import {doc, DocumentReference, setDoc} from "firebase/firestore";
import GameBirdShooter from "../models/GameBirdShooter";
import db from "../utils/db";
import User from "../models/User";
import * as uuid from "uuid"

function useCreateNewBirdShooterGame() {
    const [creationLoading, setCreationLoading] = useState(false)
    const [createdGameDoc, setCreatedGameDoc] = useState<DocumentReference<GameBirdShooter> | null>(null)

    const createNewGame = async (opponents: User[]) => {

        setCreationLoading(true)

        const newGameDoc = doc(db.gameBirdShooter, uuid.v4())

        await setDoc(newGameDoc, {
            id: newGameDoc.id,
            rounds: 5,
            playerIds: opponents.map(user => user.id),
            hits: [],
        })

        setCreatedGameDoc(newGameDoc)

        setCreationLoading(false)
    }

    return [createNewGame, createdGameDoc, creationLoading] as const
}

export default useCreateNewBirdShooterGame
