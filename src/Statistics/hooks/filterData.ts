import { useEffect, useState } from "react"
import Disciplines from "../../User/models/Disciplines"
import { DataPoint } from "../components/LinePlotWithErrorBars"
import { DataCompetition, DataTraining } from "./statisticsData"


type FilterHook = [FilteredData, Function, Function, Function]

export interface FilteredData{
    averageCompetition: number,
    averageTraining: number,
    gameResults: Array<number>,
    averageTrainingTime: number,
    trainingsNotes: Array<Array<string | null>> | null,
    competitionData: DataPoint[] | undefined,
    trainingData: DataPoint[] | undefined
}

function useFilterData(startDate: Date, endDate: Date, discipline: Disciplines, hookCompetitionData: DataCompetition[] | undefined, hookTrainingData: DataTraining[] | undefined): FilterHook{
    
    //const [competitionData, setCompetitionData] = useState(hookCompetitionData)
    //const [trainingData, setTrainingData] = useState(hookTrainingData)

    const competitionData = hookCompetitionData
    const trainingData = hookTrainingData
    
    const [filterDateStart, setFilterDateStart] = useState(startDate)
    const [filterDateEnd, setFilterDateEnd] = useState(endDate)
    const [selectedDiscipline, setSelectedDiscipline] = useState(discipline)
    const [filteredData, setFilteredData] = useState(getFilteredData())

    useEffect(() => {setFilteredData(getFilteredData())}, [selectedDiscipline, filterDateStart, filterDateEnd]);
    //useEffect(() => {console.log(competitionData)}, [competitionData]);

    const setGetDataDate = (date: Date) => {
        setFilterDateStart(date)
    }

    const setGetDataDiscipline = (discipline: Disciplines) => {
        setSelectedDiscipline(discipline)
    }

    const setGetDataEndDate = (date: Date) => {
        setFilterDateEnd(date)
    }

    function getFilteredData(){
        var competitionDataHits = getCompetitionData()
        var trainingDataHits = getTrainingData()
        var averageCompetition = getAverageCompetition()
        var averageTraining = getAverageTraining()
        var gameResults = getGameResults()
        var averageTrainingTime = getAverageTrainingTime()
        var trainingsNotes = getTrainingNotes()
        return {
            averageCompetition: averageCompetition,
            averageTraining: averageTraining,
            gameResults: gameResults,
            averageTrainingTime: averageTrainingTime,
            trainingsNotes: trainingsNotes,
            competitionData: competitionDataHits,
            trainingData: trainingDataHits
        }
    }

    function getCompetitionData(){
        if(competitionData === undefined){
            return
        }
        var filteredCompetitionData = competitionData.filter(applyFilterCompetition)
        var dataPoints =[]
        for (let i = 0; i < filteredCompetitionData.length; i++) {
            dataPoints.push(filteredCompetitionData[i].competitionHits)
        }
        return dataPoints
    }
    
    function getTrainingData(){
        if(trainingData === undefined){
            return
        }
        var filteredTrainingData = trainingData.filter(applyFilterTraining)
        var dataPoints =[]
        for (let i = 0; i < filteredTrainingData.length; i++) {
            dataPoints.push(filteredTrainingData[i].trainingHits)
        }
        return dataPoints
    }

    function getAverageCompetition(){
        if(competitionData === undefined){
            return 0
        }
        var calcAverageCompetition = 0;
        for (let i = 0; i < competitionData.length; i++) {
            if(getDateWithoutTime(competitionData[i].date) < getDateWithoutTime(filterDateStart) || competitionData[i].discipline !== selectedDiscipline || getDateWithoutTime(competitionData[i].date) > getDateWithoutTime(filterDateEnd)){
                continue;
            }
            calcAverageCompetition += competitionData[i].competitionHits.y;
        }
        calcAverageCompetition /= competitionData.length;
        calcAverageCompetition = Math.round(calcAverageCompetition * 100) / 100;
        return calcAverageCompetition;
    }

    function getAverageTraining(){
        if(trainingData === undefined){
            return 0
        }
        var calcAverageTraining = 0;
        for (let i = 0; i < trainingData.length; i++) {
            if(getDateWithoutTime(trainingData[i].date) < getDateWithoutTime(filterDateStart) || trainingData[i].discipline !== selectedDiscipline || getDateWithoutTime(trainingData[i].date) > getDateWithoutTime(filterDateEnd)){
                continue;
            }
            calcAverageTraining += trainingData[i].trainingHits.y;
        }
        calcAverageTraining /= trainingData.length;
    
        calcAverageTraining = Math.round(calcAverageTraining * 100) / 100;
        return calcAverageTraining;
    }

    function getAverageTrainingTime(){
        if(trainingData === undefined){
            return 0
        }
        var calcAverageTrainingTime = 0;
        for (let i = 0; i < trainingData.length; i++) {
            if(getDateWithoutTime(trainingData[i].date) < getDateWithoutTime(filterDateStart) || trainingData[i].discipline !== selectedDiscipline || getDateWithoutTime(trainingData[i].date) > getDateWithoutTime(filterDateEnd)){
                continue;
            }
            var trainingTime = trainingData[i].endTime.getTime() - trainingData[i].startTime.getTime();
            if(trainingTime < 0){
                continue;
            }
            calcAverageTrainingTime += trainingTime / 1000 / 60;
        }
        calcAverageTrainingTime /= trainingData.length;
        return calcAverageTrainingTime;
    }

    function getGameResults(){
        if(competitionData === undefined){
            return [0, 0, 0]
        }
        var gamesLostPercentage = 0;
        var gamesWonPercentage = 0;
        var gamesDrawPercentage = 0;
        for (let i = 0; i < competitionData.length; i++) {
            if(getDateWithoutTime(competitionData[i].date) < getDateWithoutTime(filterDateStart) || competitionData[i].discipline !== selectedDiscipline || getDateWithoutTime(competitionData[i].date) > getDateWithoutTime(filterDateEnd)){
                continue;
            }
            var winKey = competitionData[i].win;
            if(winKey === 'winner'){
                gamesWonPercentage += 1;
                continue;
            }
            else if(winKey === 'draw'){
                gamesDrawPercentage += 1;
                continue;
            }
            gamesLostPercentage += 1;
        }
        var numberGames = gamesWonPercentage + gamesLostPercentage + gamesDrawPercentage
        if(numberGames === 0){
            return [0, 0, 0]
        }
        gamesLostPercentage = gamesLostPercentage / numberGames * 100;
        gamesWonPercentage = gamesWonPercentage / numberGames * 100;
        gamesDrawPercentage = gamesDrawPercentage / numberGames * 100;
        return [gamesWonPercentage, gamesLostPercentage, gamesDrawPercentage]
    }

    function getTrainingNotes(){
        if(trainingData === undefined){
            return null
        }
        var trainingsNotes = []
        for (let index = 0; index < trainingData.length; index++) {
            if(index > 10){
                break;
            }
            if(getDateWithoutTime(trainingData[index].date) < getDateWithoutTime(filterDateStart) || trainingData[index].discipline !== selectedDiscipline || getDateWithoutTime(trainingData[index].date) > getDateWithoutTime(filterDateEnd)){
                continue;
            }
            trainingsNotes.push(
                [trainingData[index].date.toDateString(), trainingData[index].note]
            );
        }
        return trainingsNotes
    }

    function applyFilterCompetition(item: DataCompetition){
        if(item.discipline === selectedDiscipline && getDateWithoutTime(item.date) >= getDateWithoutTime(filterDateStart) && getDateWithoutTime(item.date) <= getDateWithoutTime(filterDateEnd)){
            return true
        }
        return false
    }

    function applyFilterTraining(item: DataTraining){
        if(item.discipline === selectedDiscipline && getDateWithoutTime(item.date) >= getDateWithoutTime(filterDateStart) && getDateWithoutTime(item.date) <= getDateWithoutTime(filterDateEnd)){
            return true
        }
        return false
    }

    function getDateWithoutTime(date: Date){
        return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    }

    return [filteredData, setGetDataDate, setGetDataEndDate, setGetDataDiscipline]
}

export default useFilterData