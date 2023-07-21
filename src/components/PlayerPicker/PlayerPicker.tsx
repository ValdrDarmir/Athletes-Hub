import {ChangeEvent} from "react";
import {useCollectionData} from "react-firebase-hooks/firestore";
import db from "../../utils/db";
import User from "../../models/User";

interface Props {
    authenticatedUser: User
    selectedUser: User | null

    onUserSelected(user: User | null): void
}

function PlayerPicker({authenticatedUser, selectedUser, onUserSelected}: Props) {
    const [users, usersLoading, usersError] = useCollectionData(db.users)

    const selectableUsers = users && users.filter(user => user.id !== authenticatedUser.id)

    const selectedId = selectedUser?.id || ""

    const inputChanged = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.currentTarget.value
        const user = users?.find(user => user.id === selectedId) || null
        onUserSelected(user)
    }

    return <div className="m-2">
        {usersLoading && <p>Loading users...</p>}
        {usersError && <p className="text-error">{usersError.message}</p>}
        {selectableUsers && (
            <select className="select select-bordered w-full" onChange={inputChanged} value={selectedId}>
                <option disabled value="">Wähle deinen Gegner</option>
                {selectableUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.displayName}</option>
                ))}
            </select>
        )}
    </div>
}

export default PlayerPicker
