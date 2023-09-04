import BaseDBModel from "../../shared/models/BaseDB.model";

interface UserModel extends BaseDBModel {
    displayName: string
    email: string
}

export function compareUserIds(userA: UserModel, userB: UserModel) {
    return userA.id > userB.id ? 1 : -1
}

export default UserModel
