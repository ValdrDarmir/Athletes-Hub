import React, {useEffect} from 'react';
import {BeforeStartStateHook} from "../hooks/playCompetition";
import {toast} from "react-toastify";
import {useHref} from "react-router-dom";
import UserModel from "../../User/models/User.model";
import CreatorJoin from "./CreatorJoin";
import {toDataURL} from "qrcode";
import {routes} from "../../routes";

interface Props {
    user: UserModel
    competitionId: string
    game: BeforeStartStateHook
}

function BeforeStartCompetition({user, game, competitionId}: Props) {
    const invitePath = useHref(routes.inviteCompetition.buildPath({competitionId}))
    const urlHost = window.location.host

    // TODO this is a workaround fix this
    const inviteLink = `${urlHost}/Athletes-Hub/${invitePath}`

    const [qrDataURL, setQrDataURL] = React.useState<string | null>(null)

    useEffect(() => {
        (async () => {
            const qrImage = await toDataURL(inviteLink, {margin: 1, width: 200})
            setQrDataURL(qrImage)
        })()
    }, [inviteLink])


    const copyInviteLinkClicked = async () => {
        await navigator.clipboard.writeText(inviteLink)
        toast.success("Einladungslink kopiert")
    }

    const startGameClicked = async () => {
        const result = await game.actions.startCompetition()
        if (result instanceof Error) {
            toast.error(result.message)
        }
    }

    return <div>
        <p>Der Wettbewerb hat noch nicht begonnen.</p>
        <p>Bisher angemeldet sind:</p>
        <ul>
            {game.data.participantSeries.map(p =>
                <li key={p.participant.user.id}>{p.participant.user.displayName}</li>)
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
                        <img src={qrDataURL || ""} alt="QR Code"/>
                    </div>

                    <button className="btn btn-secondary" onClick={copyInviteLinkClicked}>
                        Link kopieren
                    </button>

                    <button className="btn btn-primary" onClick={startGameClicked}>Spiel starten</button>

                    <div className="divider"></div>

                    <CreatorJoin competitionId={competitionId} user={user}/>
                </div>
            </>
        }
    </div>

}

export default BeforeStartCompetition;
