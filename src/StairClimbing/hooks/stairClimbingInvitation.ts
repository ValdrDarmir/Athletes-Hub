import {arrayUnion, doc, setDoc} from "firebase/firestore";
import db from "../../shared/utils/db";
import {useDocumentData} from "react-firebase-hooks/firestore";
import UserModel from "../../User/models/User.model";
import StairClimbingModel, {PlayerStepModel} from "../models/StairClimbing.model";

interface useInvitationHookLoading {
    loading: true
    error: null
    game: null
    isUserAlreadyAttending: null
    addPlayer: null
}

interface useInvitationHookError {
    loading: false
    error: Error
    game: null
    isUserAlreadyAttending: null
    addPlayer: null
}

interface useInvitationHookData {
    loading: false
    error: null
    game: StairClimbingModel
    isUserAlreadyAttending: boolean

    addPlayer(): Promise<void>
}

type useInvitationHook = useInvitationHookLoading | useInvitationHookError | useInvitationHookData

function useStairClimbingInvitation(entityId: string | undefined, user: UserModel): useInvitationHook {
    const [game, gameLoading, gameError] = useDocumentData(doc(db.stairClimbing, entityId))

    // Loading state
    if (gameLoading) {
        return {
            loading: true,
            error: null,
            game: null,
            isUserAlreadyAttending: null,
            addPlayer: null,
        }
    }

    // Error state
    if (gameError || !game) {
        const entityNotFoundError = !game && new Error("Competition not found")
        const unknownError = new Error("Unknown error")
        const error = gameError || entityNotFoundError || unknownError
        return {
            loading: false,
            error: error,
            game: null,
            isUserAlreadyAttending: null,
            addPlayer: null,
        }
    }

    const isUserAlreadyAttending = game.playerIds.some(userId => userId === user.id)

    const addPlayer = async () => {
        const entityDoc = doc(db.stairClimbing, entityId)

        const newPlayer: PlayerStepModel = {
            userId: user.id,
            stepIndex: 0,
        }

        await setDoc(entityDoc, {
            playerIds: arrayUnion(user.id),
            playerSteps: arrayUnion(newPlayer)
        }, {merge: true})
    }

    return {
        loading: false,
        error: null,
        game: game,
        isUserAlreadyAttending: isUserAlreadyAttending,
        addPlayer: addPlayer,
    }
}

export default useStairClimbingInvitation
