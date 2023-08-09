interface User {
    id: string
    displayName: string
    email: string
}

export function compareUserIds(userA: User, userB: User) {
    return userA.id > userB.id ? 1 : -1
}

export default User
