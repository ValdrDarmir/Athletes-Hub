import React from 'react';
import UserModel from "../../User/models/User.model";
import Icon from "../../shared/components/Icon";

interface Props {
    players: UserModel[]
}

function PlayerList({players}: Props) {
    return (
        <div className="flex flex-col align-middle self-center w-2/3">
            <p className="border-b text-center">Bisher angemeldet sind:</p>
            <div className="flex flex-wrap justify-around gap-4">
                {players.map(p =>
                    <span key={p.id}><Icon code="person"/> {p.displayName}</span>
                )}
            </div>
        </div>
    );
}

export default PlayerList;
