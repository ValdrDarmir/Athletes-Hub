import BaseDBModel from "../../shared/models/BaseDBModel";
import Disciplines from "./Disciplines";

export interface ClubDiscipline {
    club: string,
    discipline: Disciplines,
}

interface User extends BaseDBModel {
    displayName: string
    email: string
    disciplines: ClubDiscipline[]
}

export function compareUserIds(userA: User, userB: User) {
    return userA.id > userB.id ? 1 : -1
}

export default User
