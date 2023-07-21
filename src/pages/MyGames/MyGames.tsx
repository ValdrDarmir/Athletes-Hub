import User from "../../models/User";
import {Link} from "react-router-dom";
import React from "react";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {query, where} from "firebase/firestore";
import db from "../../utils/db";

interface Props {
    user: User
}

function MyGames({user}: Props) {
    const [games, gamesLoading, gamesError] = useCollectionData(query(db.gameBirdShooter, where("playerIds", "array-contains", user.id)));
    const allOpponentIds = games && games.map(game => game.playerIds).flat()
    const [opponents, opponentsLoading, opponentsError] = useCollectionData(allOpponentIds && query(db.users, where("id", "in", allOpponentIds)))

    const loading = gamesLoading || opponentsLoading
    const error = gamesError || opponentsError

    return <div className="w-full">
        {error && <p className="text-error">{error.message}</p>}
        {loading && <p>{loading}</p>}

        {games && opponents &&
					<ul className="menu m-2">
              {games.map(game =>
                  <li key={game.id}>
                      <Link to={`/game/${game.id}`} className="btn flex content-center">
                          Gegner: {game.playerIds.map(id => opponents.find(op => op.id === id)?.displayName).join(" vs ")}
                      </Link>
                  </li>
              )}
					</ul>
        }
    </div>
}

export default MyGames
