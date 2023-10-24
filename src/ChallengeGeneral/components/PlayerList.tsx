import React from 'react';
import UserModel from "../../User/models/User.model";

interface Props {
    players: UserModel[]
}

function PlayerList({players}: Props) {
    return (
        <div className="flex flex-col align-middle self-center w-2/3">
            <p className="border-b text-center">Bisher angemeldet sind:</p>
            <div className="flex flex-wrap justify-around gap-4">
                {players.map(p => <p key={p.id}>{p.displayName}</p>
                )}
            </div>
        </div>
    );
}

export default PlayerList;
