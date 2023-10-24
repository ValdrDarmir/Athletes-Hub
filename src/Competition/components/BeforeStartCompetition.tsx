import React, {useEffect} from 'react';
import {BeforeStartStateHook} from "../hooks/playCompetition";
import {toast} from "react-toastify";
import {useHref} from "react-router-dom";
import UserModel from "../../User/models/User.model";
import CreatorJoin from "./CreatorJoin";
import {toDataURL} from "qrcode";
import {routes} from "../../routes";
import PlayerList from "../../ChallengeGeneral/components/PlayerList";

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

    return <div className="flex flex-col items-center m-4 gap-8">
        <h1 className="text-3xl text-primary mt-5 uppercase">Wettbewerb</h1>

        {(game.data.creator.id === user.id) ?
            <>
                <div className="flex flex-col align-middle gap-8">
                    <p className="text-center font-bold">Du bist der Spielleiter.</p>

                    <CreatorJoin competitionId={competitionId} user={user}/>

                    <PlayerList players={game.data.participantSeries.map(p => p.participant.user)}/>

                    <p className="text-center">Teile diesen Link mit deinen Freunden, damit sie mitspielen
                        können:</p>

                    <div className="flex flex-col self-center w-2/3 gap-2">
                        <img src={qrDataURL || ""} alt="QR Code"/>

                        <button className="btn btn-sm btn-secondary" onClick={copyInviteLinkClicked}>
                            Link kopieren
                        </button>
                    </div>

                    <button className="btn btn-primary" onClick={startGameClicked} disabled={game.data.participantSeries.length < 2}>Spiel starten</button>

                </div>
            </> :
            <>
                <p className="text-center">Der Spielleiter hat den Wettbewerb noch nicht gestartet.</p>
                <PlayerList players={game.data.participantSeries.map(p => p.participant.user)}/>

            </>
        }
    </div>

}

export default BeforeStartCompetition;
