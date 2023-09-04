import {useHref, useParams} from "react-router-dom";
import usePlayBirdShooterGame, {GameStates} from "../hooks/playBirdShooterGame";
import React, {Fragment} from "react";
import {toast} from "react-toastify";
import UserModel from "../../User/models/User.model";
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import useEffectWithPrevious from "../../shared/hooks/effectWithPrevious";

interface Params {
    user: UserModel
}

function BirdShooterGame({user}: Params) {
    const {gameId} = useParams()
    const {state, data, actions} = usePlayBirdShooterGame(gameId)

    const invitePath = useHref(`/invite/${gameId}`)
    const urlHost = window.location.host
    const inviteLink = `${urlHost}/${invitePath}`

    // Pop a toast when the game starts
    useEffectWithPrevious(([prevState]) => {
        if ((state !== prevState) && state === GameStates.InGame) {
            toast.info(`Das Spiel beginnt!`)
        }
    }, [state])

    if (state === GameStates.Loading) {
        return <p>loading...</p>
    }

    if (state === GameStates.Error) {
        return <ErrorDisplay error={data}/>
    }

    if (state === GameStates.BeforeGame) {
        const copyInviteLinkClicked = async () => {
            await navigator.clipboard.writeText(inviteLink)
            toast.success("Einladungslink kopiert")
        }

        const startGameClicked = async () => {
            const result = await actions.startGame()
            if (result instanceof Error) {
                toast.error(result.message)
            }
        }

        return <div>
            <p>Das Spiel hat noch nicht begonnen.</p>
            <p>Bisher angemeldet sind:</p>
            <ul>
                {data.players.map(player =>
                    <li key={player.id}>{player.displayName}</li>)
                }
            </ul>
            {(data.creator.id === user.id) &&
                <>
                    <div className="divider"></div>
                    <p className="text-center font-bold">Du bist der Spielleiter.</p>

                    <p className="text-center">Teile diesen Link mit deinen Freunden, damit sie mitspielen können:</p>

                    <div className="flex justify-center">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${inviteLink}`}
                             alt="QR Code"/>
                    </div>

                    <button className="btn btn-secondary" onClick={copyInviteLinkClicked}>
                        Link kopieren
                    </button>


                    <button className="btn btn-primary" onClick={startGameClicked}>Spiel starten</button>
                </>
            }
        </div>

    }

    if (state === GameStates.AfterGame) {
        const winnerScore = data.hitsPerPlayer
            .find(series => series.player.id === data.winner.id)
            ?.currentScore

        return <div>
            <p>Das Spiel ist beendet.</p>
            <p>Der Gewinner ist <span className="font-bold">{data.winner.displayName}</span> mit {winnerScore}!!!</p>
        </div>
    }

    if (state === GameStates.InGame) {
        const scoreClicked = (score: number) => {
            void actions.newHit(score)
        }

        return <div className="flex items-center flex-col p-2">
            <h1 className="text-2xl">
                {data.hitsPerPlayer.map((series, index) => <Fragment key={`names-${index}`}>
                        {(index > 0) && <span> vs </span>}
                        <span className="font-bold">{series.player.displayName}</span>
                    </Fragment>
                )}
            </h1>

            <p>Runde {data.currentRound}</p>
            <p>An der Reihe ist {data.currentPlayer.displayName}</p>

            <div className="card bg-base-100/90">
                <div className="card-body grid grid-cols-3">
                    <button className="btn" onClick={() => scoreClicked(9)}>9</button>
                    <button className="btn" onClick={() => scoreClicked(10)}>10</button>
                    <button className="btn" onClick={() => scoreClicked(11)}>11</button>
                    <button className="btn" onClick={() => scoreClicked(12)}>12</button>
                    <button className="btn" onClick={() => scoreClicked(0)}>Daneben</button>
                </div>
            </div>

            <div className="grid grid-flow-col">
                {
                    data.hitsPerPlayer.map((series, index) => (
                        <Fragment key={series.player.id}>
                            {(index > 0) && <div className="divider divider-horizontal"></div>}
                            <div className="card bg-base-100">
                                <div className="flex flex-col items-center">
                                    <p>{series.player.displayName}</p>
                                    <p>Punkte: {series.currentScore}</p>
                                </div>
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>Runde</th>
                                        <th>Treffer</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {series.series.map((score, round) => (
                                        <tr key={`${series.player.id}-${round}`}>
                                            <td>{round + 1}</td>
                                            <td>{score}</td>
                                        </tr>
                                    ))}
                                    {[...Array(data.maxRounds - series.series.length)].map((_, index) => (
                                        <tr key={`${series.player.id}-${index + series.series.length + 1}`}>
                                            <td>{index + series.series.length + 1}</td>
                                            <td></td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </Fragment>
                    ))
                }
            </div>
        </div>
    }

    return <p>Unknown state</p>
}

export default BirdShooterGame
