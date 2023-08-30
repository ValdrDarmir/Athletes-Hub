import {arrayUnion, doc, limit, query, setDoc, where} from "firebase/firestore";
import db from "../../shared/utils/db";
import Participant from "../models/Participant";
import ClubDiscipline from "../../User/models/ClubDiscipline";
import {useCollectionData} from "react-firebase-hooks/firestore";
import Disciplines from "../../User/models/Disciplines";
import User from "../../User/models/User";

interface Invitable {
    id: string
    participants: Participant[]
    discipline: Disciplines
    // TODO define some attributes, that all games, tournament and other stuff, that players can be invited to must have
}

interface useInvitationHookLoading {
    loading: true
    error: null
    entity: null
    validUserClubDisciplines: null
    isUserAlreadyAttending: null
    addPlayer: null
}

interface useInvitationHookError {
    loading: false
    error: Error
    entity: null
    validUserClubDisciplines: null
    isUserAlreadyAttending: null
    addPlayer: null
}

interface useInvitationHookData {
    loading: false
    error: null
    entity: Invitable
    validUserClubDisciplines: ClubDiscipline[]
    isUserAlreadyAttending: boolean

    addPlayer(clubDisciplineId: string): Promise<void>
}

type useInvitationHook = useInvitationHookLoading | useInvitationHookError | useInvitationHookData

function useInvitation(entityId: string | undefined, user: User): useInvitationHook {
    // query all collections, where invitations are possible
    const [bsGame, bsLoading, bsError] = useCollectionData(query(db.gameBirdShooter, where("id", "==", entityId), limit(1)))
    // TODO add other stuff, like tournaments here
    const entity: Invitable | undefined = bsGame?.at(0)

    const [clubDisciplines, clubDisciplinesLoading, clubDisciplinesError] = useCollectionData(query(db.clubDisciplines, where("userId", "==", user.id)))


    // Loading state
    if (bsLoading || clubDisciplinesLoading) {
        return {
            loading: true,
            error: null,
            entity: null,
            validUserClubDisciplines: null,
            isUserAlreadyAttending: null,
            addPlayer: null,
        }
    }

    // Error state
    if (bsError || clubDisciplinesError || !clubDisciplines || !entity) {
        const entityNotFoundError = !entity && new Error("Entity not found")
        const clubDisciplinesNotFoundError = !clubDisciplines && new Error("No club-disciplines not found")
        const unknownError = new Error("Unknown error")
        const error = bsError || clubDisciplinesError || entityNotFoundError || clubDisciplinesNotFoundError || unknownError
        return {
            loading: false,
            error: error,
            entity: null,
            validUserClubDisciplines: null,
            isUserAlreadyAttending: null,
            addPlayer: null,
        }
    }

    const isUserAlreadyAttending = entity.participants.some(participant => participant.userId === user.id)

    const validUserClubDisciplines = clubDisciplines.filter(clubDiscipline => clubDiscipline.discipline === entity.discipline)

    const addPlayer = async (clubDisciplineId: string) => {
        // TODO discriminate between collections
        const entityDoc = doc(db.gameBirdShooter, entityId)

        const newParticipant: Participant = {
            userId: user.id,
            clubDisciplineId: clubDisciplineId,
        }

        await setDoc(entityDoc, {
            participants: arrayUnion(newParticipant),
        }, {merge: true})
    }

    return {
        loading: false,
        error: null,
        entity: entity,
        isUserAlreadyAttending: isUserAlreadyAttending,
        validUserClubDisciplines: validUserClubDisciplines,
        addPlayer: addPlayer,
    }
}

export default useInvitation
