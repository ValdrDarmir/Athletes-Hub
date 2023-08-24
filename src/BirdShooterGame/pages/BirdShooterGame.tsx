import {useHref, useParams} from "react-router-dom";
import usePlayBirdShooterGame from "../hooks/playBirdShooterGame";
import {Fragment, useEffect} from "react";
import {toast} from "react-toastify";
import User from "../../App/models/User";

interface Params {
    user: User
}

function BirdShooterGame({user}: Params) {
    const {gameId} = useParams()
    const {loading, error, gameState, gameActions} = usePlayBirdShooterGame(gameId)
    const invitePath = useHref(`/invite/${gameId}`)

    const urlHost = window.location.host
    const inviteLink = `${urlHost}/${invitePath}`

    // Pop a toast when the game starts
    // TODO this triggers too often, we should build a useEffect, that provides the previous values
    useEffect(() => {
        if (gameState?.gameRunning) {
            toast.info(`Das Spiel beginnt!`)
        }
    }, [gameState?.gameRunning])

    if (loading) {
        return <p>loading...</p>
    }

    if (error) {
        return <p className="text-error">{error.message}</p>
    }

    if (!gameState || !gameActions) {
        return <p className="text-error">Irgendwas ist schief gelaufen</p>
    }

    const scoreClicked = (score: number) => {
        void gameActions.newHit(score)
    }

    const startGameClicked = () => {
        void gameActions.startGame()
    }

    const copyInviteLinkClicked = async () => {
        await navigator.clipboard.writeText(inviteLink)
        toast.success("Einladungslink kopiert")
    }

    return <div className="flex items-center flex-col p-2">
        <h1 className="text-2xl">
            {gameState.hitsPerPlayer.map((playerHits, index) => <Fragment key={`names-${index}`}>
                    {(index > 0) && <span> vs </span>}
                    <span className="font-bold">{playerHits.player.displayName}</span>
                </Fragment>
            )}
        </h1>

        {gameState.winner ?
            <p>Der Gewinner ist <span className="font-bold">{gameState.winner.displayName}</span>!!!</p> :
            <>
                <p>Runde {gameState.currentRound}</p>
                <p>An der Reihe ist {gameState.currentPlayer.displayName}</p>
            </>
        }

        <div className="card bg-base-100/90">
            <div className="card-body grid grid-cols-3">
                <button className="btn" onClick={() => scoreClicked(9)}
                        disabled={Boolean(gameState.winner) || !gameState.gameRunning}>9
                </button>
                <button className="btn" onClick={() => scoreClicked(10)}
                        disabled={Boolean(gameState.winner) || !gameState.gameRunning}>10
                </button>
                <button className="btn" onClick={() => scoreClicked(11)}
                        disabled={Boolean(gameState.winner) || !gameState.gameRunning}>11
                </button>
                <button className="btn" onClick={() => scoreClicked(12)}
                        disabled={Boolean(gameState.winner) || !gameState.gameRunning}>12
                </button>
                <button className="btn" onClick={() => scoreClicked(0)}
                        disabled={Boolean(gameState.winner) || !gameState.gameRunning}>Daneben
                </button>
            </div>
        </div>

        <div className="grid grid-flow-col">
            {
                gameState.hitsPerPlayer.map((playerHits, index) => (
                    <Fragment key={playerHits.player.id}>
                        {(index > 0) && <div className="divider divider-horizontal"></div>}
                        <div className="card bg-base-100">
                            <div className="flex flex-col items-center">
                                <p>{playerHits.player.displayName}</p>
                                <p>Punkte: {playerHits.currentScore}</p>
                            </div>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Runde</th>
                                    <th>Treffer</th>
                                </tr>
                                </thead>
                                <tbody>
                                {playerHits.hits.map((score, round) => (
                                    <tr key={`${playerHits.player.id}-${round}`}>
                                        <td>{round + 1}</td>
                                        <td>{score}</td>
                                    </tr>
                                ))}
                                {[...Array(gameState.maxRounds - playerHits.hits.length)].map((_, index) => (
                                    <tr key={`${playerHits.player.id}-${index + playerHits.hits.length + 1}`}>
                                        <td>{index + playerHits.hits.length + 1}</td>
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

        {(gameState.creator.id === user.id) && !gameState.gameRunning &&
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

export default BirdShooterGame
