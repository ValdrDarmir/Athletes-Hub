import {useCollectionData} from "react-firebase-hooks/firestore";
import {query, where} from "firebase/firestore";
import db from "../../shared/utils/db";
import {getGameFinished} from "../../BirdShooterGame/models/BirdShooterGame.model";
import average from "../../shared/utils/average";
import {DataPoint} from "../components/LinePlotWithErrorBars";

type StatisticsDataHook = [boolean, Error | null, { birdShooterHits: DataPoint[] } | null]

function useStatisticsData(userId: string): StatisticsDataHook {
    const [birdShooterGames, birdShooterGamesLoading, birdShooterGamesError] = useCollectionData(query(db.gameBirdShooter, where("playerIds", "array-contains", userId)));

    if (birdShooterGamesLoading) {
        return [true, null, null]
    }

    if (birdShooterGamesError || !birdShooterGames) {
        const noBirdShooterGamesError = !birdShooterGames && new Error("No bird shooter games found")
        const unknownError = birdShooterGamesError || new Error("Unknown error")

        const error = birdShooterGamesError || noBirdShooterGamesError || unknownError

        return [false, error, null]
    }

    // all hits from one user
    const hitsData = birdShooterGames
        .filter(game => getGameFinished(game))
        .map(game => {
            const scores = game.series
                .filter(hit => hit.playerId === userId)
                .map(hit => hit.score)

            return {
                date: game.createdAt,
                y: average(...scores),
                yMin: Math.min(...scores),
                yMax: Math.max(...scores),
            }
        })


    return [false, null, {birdShooterHits: hitsData,}]
}

export default useStatisticsData
