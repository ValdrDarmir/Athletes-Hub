import React from 'react';
import {BeforeGameStateHook} from "../hooks/playBirdShooterGame";
import {toast} from "react-toastify";
import {useHref} from "react-router-dom";
import UserModel from "../../User/models/User.model";
import CreatorJoin from "./CreatorJoin";

interface Props {
    user: UserModel
    gameId: string
    game: BeforeGameStateHook
}

function BeforeBirdShooterGame({user, game, gameId}: Props) {
    const invitePath = useHref(`/invite/${gameId}`)
    const urlHost = window.location.host
    const inviteLink = `${urlHost}/${invitePath}`

    const copyInviteLinkClicked = async () => {
        await navigator.clipboard.writeText(inviteLink)
        toast.success("Einladungslink kopiert")
    }

    const startGameClicked = async () => {
        const result = await game.actions.startGame()
        if (result instanceof Error) {
            toast.error(result.message)
        }
    }

    return <div>
        <p>Das Spiel hat noch nicht begonnen.</p>
        <p>Bisher angemeldet sind:</p>
        <ul>
            {game.data.participantSeries.map(p =>
                <li key={p.user.id}>{p.user.displayName}</li>)
            }
        </ul>
        {(game.data.creator.id === user.id) &&
            <>
                <div className="divider"></div>
                <div className="flex flex-col gap-2">
                    <p className="text-center font-bold">Du bist der Spielleiter.</p>

                    <p className="text-center">Teile diesen Link mit deinen Freunden, damit sie mitspielen
                        können:</p>

                    <div className="flex justify-center">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${inviteLink}`}
                             alt="QR Code"/>
                    </div>

                    <button className="btn btn-secondary" onClick={copyInviteLinkClicked}>
                        Link kopieren
                    </button>

                    <button className="btn btn-primary" onClick={startGameClicked}>Spiel starten</button>

                    <div className="divider"></div>

                    <CreatorJoin gameId={gameId} user={user}/>
                </div>
            </>
        }
    </div>

}

export default BeforeBirdShooterGame;
