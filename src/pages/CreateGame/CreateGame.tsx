import User from "../../models/User";
import React, {useEffect, useState} from "react";
import PlayerPicker from "../../components/PlayerPicker/PlayerPicker";
import {useNavigate} from "react-router-dom";
import useCreateNewBirdShooterGame from "../../hooks/createNewBirdShooterGame";

interface Props {
    user: User
}

function CreateGame({user}: Props) {

    const [selectedOpponent, setSelectedOpponent] = useState<User | null>(null)
    const [createNewBirdShooterGame, createdNewBirdShooterGame, creationBirdShooterGameLoading] = useCreateNewBirdShooterGame()
    const navigate = useNavigate()

    useEffect(() => {
        if (createdNewBirdShooterGame) {
            navigate(`/game/${createdNewBirdShooterGame.id}`)
        }
    }, [createdNewBirdShooterGame, navigate])

    const opponentSelected = (user: User | null) => {
        setSelectedOpponent(user)
    }

    const startGameClicked = async () => {
        if (!selectedOpponent) {
            console.error("No opponent!")
            return;
        }

        await createNewBirdShooterGame([selectedOpponent, user])
    }

    return <div className="flex flex-col items-center m-2">
        <h1 className="text-2xl">Such dir erst mal nen Gegner</h1>
        <div className="w-full">
            <PlayerPicker
                authenticatedUser={user}
                selectedUser={selectedOpponent}
                onUserSelected={opponentSelected}
            />
        </div>

        {selectedOpponent &&
					<p><span className="font-bold">{selectedOpponent.displayName}</span> also? Das wird ne heiße Nummer!</p>
        }

        <button className="btn btn-primary" disabled={!selectedOpponent || creationBirdShooterGameLoading}
                onClick={startGameClicked}>Los geht's!
        </button>
    </div>

}

export default CreateGame
