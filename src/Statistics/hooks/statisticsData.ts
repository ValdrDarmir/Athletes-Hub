import {useCollectionData} from "react-firebase-hooks/firestore";
import {query} from "firebase/firestore";
import db from "../../shared/utils/db";
import average from "../../shared/utils/average";
import {DataPoint} from "../components/LinePlotWithErrorBars";
import CompetitionModel, {CompetitionStates, getState} from "../../Competition/models/Competition.model";
import whereTyped from "../../shared/utils/whereTyped";

type StatisticsDataHook = [boolean, Error | null, { birdShooterHits: DataPoint[] } | null]

function useStatisticsData(userId: string): StatisticsDataHook {
    const [birdShooterGames, birdShooterGamesLoading, birdShooterGamesError] = useCollectionData(query(db.competition, whereTyped<CompetitionModel>("participantIds", "array-contains", userId)));

    if (birdShooterGamesLoading) {
        return [true, null, null]
    }

    if (birdShooterGamesError || !birdShooterGames) {
        const noBirdShooterGamesError = !birdShooterGames && new Error("No bird shooter games found")
        const unknownError = new Error("Unknown error")

        const error = birdShooterGamesError || noBirdShooterGamesError || unknownError

        return [false, error, null]
    }

    const seriesData = birdShooterGames
        .filter(game => getState(game) === CompetitionStates.AfterCompetition)
        .sort((a, b) => a.createdAt < b.createdAt ? -1 : 1)
        .map(game => {
            const scores = game.participantSeries
                .find(p => p.participant.userId === userId)!
                .series

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
