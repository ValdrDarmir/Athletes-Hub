import {useCollectionData} from "react-firebase-hooks/firestore";
import {query} from "firebase/firestore";
import db from "../../shared/utils/db";
import average from "../../shared/utils/average";
import {DataPoint} from "../components/LinePlotWithErrorBars";
import CompetitionModel, {CompetitionStates, getState} from "../../Competition/models/Competition.model";
import whereTyped from "../../shared/utils/whereTyped";
import TrainingEntryModel from "../../Training/models/TrainingEntry.model";


export interface DataCompetition{
    type: string
    competitionHits: DataPoint,
    win: string,
    discipline: string
    date: Date
}

export interface DataTraining{
    type: string,
    trainingHits: DataPoint,
    date: Date
    startTime: Date,
    endTime: Date,
    discipline: string,
    note: string | null
}

type StatisticsDataHook = [boolean, Error | null, { data: [DataCompetition[], DataTraining[]] } | null]

function useStatisticsData(userId: string): StatisticsDataHook {
    const [birdShooterGames, birdShooterGamesLoading, birdShooterGamesError] = useCollectionData(query(db.competition, whereTyped<CompetitionModel>("participantIds", "array-contains", userId)));
    const [trainingData, trainingDataLoading, trainingDataError] = useCollectionData(query(db.training, whereTyped<TrainingEntryModel>("userId", "==", userId)));
    
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
                var gameWon = ''
                var seriesResults = game.participantSeries;
                var highestScore = -1
                var winner = []
                for (let i = 0; i < seriesResults.length; i++) {
                    var serieses = seriesResults[i].series
                    var score = 0
                    for (let i = 0; i < serieses.length; i++) {
                        score += serieses[i]
                    }
                    if(score < highestScore){
                        continue;
                    }
                    if(score === highestScore){
                        winner.push(seriesResults[i].participant.userId)
                        continue
                    }
                    winner = []
                    winner.push(seriesResults[i].participant.userId)
                }
                if(winner.length === 1 && winner.includes(userId)){
                    gameWon = 'winner'
                }
                else if(winner.includes(userId)){
                    gameWon = 'draw'
                }
                else{
                    gameWon = 'looser'
                }
            return {
                type: 'competition',
                competitionHits: {
                    date: game.createdAt,
                    y: average(...scores),
                    yMin: Math.min(...scores),
                    yMax: Math.max(...scores),
                },
                win: gameWon,
                discipline: game.discipline,
                date: game.createdAt,
            }
        })

        if (trainingDataLoading) {
            return [true, null, null]
        }
        
        if (trainingDataError || !trainingData) {
            const noBirdShooterGamesError = !birdShooterGames && new Error("No bird shooter games found")
            const unknownError = new Error("Unknown error")
        
            const error = birdShooterGamesError || noBirdShooterGamesError || unknownError
        
            return [false, error, null]
        }

        const results = trainingData
        .map(data => {
            const scoreData = data.series
            const notes = data.notes
            return{
                type: "training",
                trainingHits: {
                    date: data.createdAt,
                    y: average(...scoreData),
                    yMin: Math.min(...scoreData),
                    yMax: Math.max(...scoreData),
                },
                date: data.createdAt,
                startTime: data.startDate,
                endTime: data.endDate,
                discipline: data.discipline,
                note: notes
            }
        })

    return [false, null, {data: [seriesData, results]}]
}

export default useStatisticsData
