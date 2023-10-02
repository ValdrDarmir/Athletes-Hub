import {arrayUnion, doc, query, setDoc} from "firebase/firestore";
import db from "../../shared/utils/db";
import ClubDisciplineModel from "../../User/models/ClubDiscipline.model";
import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import UserModel from "../../User/models/User.model";
import CompetitionModel, {ParticipantSeriesModel} from "../../Competition/models/Competition.model";
import whereTyped from "../../shared/utils/whereTyped";

interface useInvitationHookLoading {
    loading: true
    error: null
    competition: null
    validUserClubDisciplines: null
    isUserAlreadyAttending: null
    addPlayer: null
}

interface useInvitationHookError {
    loading: false
    error: Error
    competition: null
    validUserClubDisciplines: null
    isUserAlreadyAttending: null
    addPlayer: null
}

interface useInvitationHookData {
    loading: false
    error: null
    competition: CompetitionModel
    validUserClubDisciplines: ClubDisciplineModel[]
    isUserAlreadyAttending: boolean

    addPlayer(clubDisciplineId: string): Promise<void>
}

type useInvitationHook = useInvitationHookLoading | useInvitationHookError | useInvitationHookData

function useCompetitionInvitation(entityId: string | undefined, user: UserModel): useInvitationHook {
    const [competition, competitionLoading, competitionError] = useDocumentData(doc(db.competition, entityId))

    const [clubDisciplines, clubDisciplinesLoading, clubDisciplinesError] = useCollectionData(query(db.clubDisciplines, whereTyped<ClubDisciplineModel>("userId", "==", user.id)))


    // Loading state
    if (competitionLoading || clubDisciplinesLoading) {
        return {
            loading: true,
            error: null,
            competition: null,
            validUserClubDisciplines: null,
            isUserAlreadyAttending: null,
            addPlayer: null,
        }
    }

    // Error state
    if (competitionError || clubDisciplinesError || !clubDisciplines || !competition) {
        const entityNotFoundError = !competition && new Error("Competition not found")
        const clubDisciplinesNotFoundError = !clubDisciplines && new Error("No club-disciplines not found")
        const unknownError = new Error("Unknown error")
        const error = competitionError || clubDisciplinesError || entityNotFoundError || clubDisciplinesNotFoundError || unknownError
        return {
            loading: false,
            error: error,
            competition: null,
            validUserClubDisciplines: null,
            isUserAlreadyAttending: null,
            addPlayer: null,
        }
    }

    const isUserAlreadyAttending = competition.participantSeries.some(ps => ps.participant.userId === user.id)

    const validUserClubDisciplines = clubDisciplines.filter(clubDiscipline => clubDiscipline.discipline === competition.discipline)

    const addPlayer = async (clubDisciplineId: string) => {
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
        competition: competition,
        isUserAlreadyAttending: isUserAlreadyAttending,
        validUserClubDisciplines: validUserClubDisciplines,
        addPlayer: addPlayer,
    }
}

export default useCompetitionInvitation
