import {useParams} from "react-router-dom";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {limit, query, where} from "firebase/firestore";
import db from "../../utils/db";

function BirdShooterGame() {
    const {gameId} = useParams()
    const [games, gameLoading, gameError] = useCollectionData(query(db.gameBirdShooter, where("id", "==", gameId), limit(1)))
    const game = (games && games.length > 0) ? games[0] : null
    const [opponents, opponentsLoading, opponentsError] = useCollectionData(game && query(db.users, where("id", "in", game.playerIds)))

    const loading = gameLoading || opponentsLoading
    const error = gameError || opponentsError

    if (loading) {
        return <p>loading...</p>
    }

    if (error) {
        return <p className="text-error">{error.message}</p>
    }

    if (!game) {
        return <p className="text-error">Game wurde nicht gefunden!</p>
    }

    return <div>
        <h1>
            Hier fighten
            gerade {game.playerIds.map(userId => opponents?.find(op => op.id === userId)?.displayName).join(" und ")}
        </h1>
    </div>
}

export default BirdShooterGame
