import React from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {arrayUnion, doc, limit, query, setDoc, where} from "firebase/firestore";
import db from "../../../shared/utils/db";
import User from "../../../App/models/User";

interface Invitable {
    id: string
    playerIds: string[]
    // TODO define some attributes, that all games, tournament and other stuff, that players can be invited to must have
}

interface Props {
    user: User
}

function Invitation({user}: Props) {
    const {entityId} = useParams()

    const navigate = useNavigate()
    // query all collections, where invitations are possible
    const [bsGame, bsLoading, bsError] = useCollectionData(query(db.gameBirdShooter, where("id", "==", entityId), limit(1)))
    // TODO add other stuff, like tournaments here

    const entity: Invitable | null = bsGame?.at(0) || null


    const entityNotFoundError = !entity && new Error("Entity not found")

    const loading = bsLoading
    const error = bsError || entityNotFoundError


    if (loading) {
        return <p>{loading}</p>
    }

    if (error || !entity) {
        const unknownError = new Error("Unknown error happened") // This should not happen
        return <p className="text-error">{(error || unknownError).message}</p>
    }

    const isAlreadyAttending = entity.playerIds.includes(user.id)

    const addPlayer = async () => {
        // TODO discriminate between collections
        const entityDoc = doc(db.gameBirdShooter, entity.id)
        await setDoc(entityDoc, {
            playerIds: arrayUnion(user.id)
        }, {merge: true})
        navigate(`/game/${entity.id}`)
    }

    return (
        <div>
            {isAlreadyAttending ?
                <span>Du bist dabei!</span> :
                <>
                    <span>Willst du mitmachen?</span>
                    <button className="btn" onClick={addPlayer}>Bin dabei!</button>
                </>
            }
        </div>
    );
}

export default Invitation;
