import React from 'react';
import UserModel from '../../User/models/User.model';
import AddTrainingEntryForm from "../components/AddTrainingEntryForm";
import useTrainingEntries from "../hooks/trainingEntries";

interface Props {
    user: UserModel
}

function AddTrainingEntry({user}: Props) {
    const {trainingEntries, loading, error, addTrainingEntry} = useTrainingEntries(user.id)

    return (
        <div className="m-2">
            <AddTrainingEntryForm addTrainingEntry={addTrainingEntry}/>
        </div>
    );
}

export default AddTrainingEntry;
