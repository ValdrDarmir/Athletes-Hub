import {arrayUnion, doc, query, setDoc} from "firebase/firestore";
import db from "../../shared/utils/db";
import ClubDisciplineModel from "../../User/models/ClubDiscipline.model";
import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import Disciplines from "../../User/models/Disciplines";
import UserModel from "../../User/models/User.model";
import {ParticipantSeriesModel} from "../../Competition/models/CompetitionModel";
import whereTyped from "../../shared/utils/whereTyped";

interface Invitable {
    id: string
    participantIds: string[]
    participantSeries: ParticipantSeriesModel[]
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
    validUserClubDisciplines: ClubDisciplineModel[]
    isUserAlreadyAttending: boolean

    addPlayer(clubDisciplineId: string): Promise<void>
}

type useInvitationHook = useInvitationHookLoading | useInvitationHookError | useInvitationHookData

function useInvitation(entityId: string | undefined, user: UserModel): useInvitationHook {
    // query all collections, where invitations are possible
    const [bsGame, bsLoading, bsError] = useDocumentData(doc(db.competition, entityId))
    // TODO add other stuff, like tournaments here
    const entity: Invitable | undefined = bsGame

    const [clubDisciplines, clubDisciplinesLoading, clubDisciplinesError] = useCollectionData(query(db.clubDisciplines, whereTyped<ClubDisciplineModel>("userId", "==", user.id)))


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

    const isUserAlreadyAttending = entity.participantSeries.some(ps => ps.participant.userId === user.id)

    const validUserClubDisciplines = clubDisciplines.filter(clubDiscipline => clubDiscipline.discipline === entity.discipline)

    const addPlayer = async (clubDisciplineId: string) => {
        // TODO discriminate between collections
        const entityDoc = doc(db.competition, entityId)

        const newParticipant: ParticipantSeriesModel = {
            participant: {
                userId: user.id,
                clubDisciplineId: clubDisciplineId,
            },
            series: [],
        }

        await setDoc(entityDoc, {
            participantIds: arrayUnion(user.id),
            participantSeries: arrayUnion(newParticipant)
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
