import {useCollectionData} from "react-firebase-hooks/firestore";
import {query} from "firebase/firestore";
import db from "../../shared/utils/db";
import average from "../../shared/utils/average";
import {DataPoint} from "../components/LinePlotWithErrorBars";
import BirdShooterGameModel, {BirdShooterGameStates, getState} from "../../BirdShooterGame/models/BirdShooterGame.model";
import whereTyped from "../../shared/utils/whereTyped";

type StatisticsDataHook = [boolean, Error | null, { birdShooterHits: DataPoint[] } | null]

function useStatisticsData(userId: string): StatisticsDataHook {
    const [birdShooterGames, birdShooterGamesLoading, birdShooterGamesError] = useCollectionData(query(db.gameBirdShooter, whereTyped<BirdShooterGameModel>("participantIds", "array-contains", userId)));

    if (birdShooterGamesLoading) {
        return [true, null, null]
    }

    if (birdShooterGamesError || !birdShooterGames) {
        const noBirdShooterGamesError = !birdShooterGames && new Error("No bird shooter games found")
        const unknownError = birdShooterGamesError || new Error("Unknown error")

        const error = birdShooterGamesError || noBirdShooterGamesError || unknownError

        return [false, error, null]
    }

    const seriesData = birdShooterGames
        .filter(game => getState(game) === BirdShooterGameStates.AfterGame)
        .map(game => {
            const scores = game.participantSeries
                .filter(p => p.participant.userId === userId)
                .map(p => p.series)
                .flat()

            return {
                date: game.createdAt,
                y: average(...scores),
                yMin: Math.min(...scores),
                yMax: Math.max(...scores),
            }
        })


    return [false, null, {birdShooterHits: seriesData,}]
}

export default useStatisticsData
