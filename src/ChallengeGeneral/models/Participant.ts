import UserModel from "../../User/models/User.model";
import JoinReplace from "../../shared/models/JoinReplace";
import ClubDisciplineModel from "../../User/models/ClubDiscipline.model";

/**
 * Joins a player and the club-discipline he is participating with.
 */
interface Participant {
    userId: string,
    clubDisciplineId: string,
}

export type UserJoinedParticipant = JoinReplace<Participant, "userId", UserModel>
export type ClubJoinedParticipant = JoinReplace<Participant, "clubDisciplineId", UserModel>

// TODO make this work, this is a workaround
// export type UserClubJoinedParticipant = JoinReplace<Participant, ...>
export type UserClubJoinedParticipant = {
    user: UserModel,
    clubDiscipline: ClubDisciplineModel
}

export default Participant
