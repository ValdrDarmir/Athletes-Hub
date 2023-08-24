import BaseDBModel from "../../shared/models/BaseDBModel";

interface User extends BaseDBModel {
    displayName: string
    email: string
}

export function compareUserIds(userA: User, userB: User) {
    return userA.id > userB.id ? 1 : -1
}

export default User
