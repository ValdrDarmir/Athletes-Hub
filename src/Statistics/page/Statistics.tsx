import React, { useCallback, useEffect, useState } from 'react';
import UserModel from "../../User/models/User.model";
import LinePlotWithErrorBars from "../components/LinePlotWithErrorBars";
import useStatisticsData from "../hooks/statisticsData";
import ErrorDisplay from "../../shared/components/ErrorDisplay";  // This needs to be imported when using charts
import Disciplines, { disciplineNames } from '../../User/models/Disciplines';
import useFilterData from '../hooks/filterData';

interface Props {
    user: UserModel
}

const INITIAL_DISCIPLINE = Disciplines.Pistol
const CURRENT_DATE = new Date()
const START_DATE = new Date(CURRENT_DATE.getFullYear(), CURRENT_DATE.getMonth() - 1, CURRENT_DATE.getDay())


function Statistics({user}: Props) {
    const [statsLoading, statsError, statsData] = useStatisticsData(user.id);
    const [, setDate, setDateEnd, setSelectedDiscipline, getFilteredData] = useFilterData(START_DATE, CURRENT_DATE, INITIAL_DISCIPLINE);//, statsData?.data[0], statsData?.data[1])

    const data = getFilteredData(statsData?.data[0], statsData?.data[1])

    const createTrainingsNotes = useCallback((data: any) => {
        var constructNotesTable = [<h1 className='text-2xl'>Training notes:</h1>];
        var notes = []
        if(data.trainingsNotes === null){
            return
        }
        for (let i = 0; i < data.trainingsNotes.length; i++) {
            notes.push(
                <tr>
                <td>{data.trainingsNotes[i][0]}: </td><td>{data.trainingsNotes[i][1]}</td>
                </tr>
            );
        }
        constructNotesTable.push(
            <table>
                <tbody>
                    {notes}
                </tbody>
            </table>
        )
        return constructNotesTable
    }, [])

    const getCompetitionPlot = useCallback((data: any) => {
        if(data.competitionData === undefined){
            return null
        }
        return <LinePlotWithErrorBars yTitle={"Treffer"} xTitle={"Datum"} dataPoints={data.competitionData}/>
    }, [])

    const getTrainingsPlot = useCallback((data: any) =>{
        if(data.trainingData === undefined){
            return null
        }
        return <LinePlotWithErrorBars yTitle={"Treffer"} xTitle={"Datum"} dataPoints= {data.trainingData}/>
    }, [])


    const setStartDate = useCallback((date : Date | null) => {
        setDate(date)
    }, [setDate])

    const setEndDate = useCallback((date: Date | null) => {
        setDateEnd(date)
    }, [setDateEnd])

    const disciplineChanged = useCallback((newDiscipline: string) => {
        setSelectedDiscipline(newDiscipline);
    }, [setSelectedDiscipline])
    
    const notesTable = createTrainingsNotes(data);
    const competitionPlot = getCompetitionPlot(data);
    const trainingsPlot = getTrainingsPlot(data);
    
    
    if (statsLoading) {
        return <p>Loading...</p>
    }

    if (statsError || !statsData) {
        return <ErrorDisplay error={statsError}/>
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className='text-2xl'>Filter:</h1>
            <div className="form-control">
                <label className="label"><span className="label-text">Disziplin</span></label>
                <select className="select select-bordered" onChange={event => disciplineChanged(event.target.value.toString())} defaultValue={INITIAL_DISCIPLINE}>
                    <option value={Disciplines.AirRifle}>{disciplineNames[Disciplines.AirRifle]}</option>
                    <option value={Disciplines.Pistol}>{disciplineNames[Disciplines.Pistol]}</option>
                </select>
            </div>
            <div className="form-control">
                <label className="label"><span className="label-text">Start Date</span></label>
                <input className="input input-bordered" onChange={event => setStartDate(event.target.valueAsDate)} type="date" defaultValue={START_DATE.toISOString().split('T')[0]}/>
            </div>
            <div className="form-control">
                <label className="label"><span className="label-text">End Date</span></label>
                <input className="input input-bordered" onChange={event => setEndDate(event.target.valueAsDate)} type="date" defaultValue={CURRENT_DATE.toISOString().split('T')[0]}/>
            </div>
            <h1 className='text-2xl'>Seriendurchschnitt Competition:</h1>
            <h1 className='text-2xl'>{data.averageCompetition}</h1>
            <h1 className='text-2xl'>Seriendurchschnitt Training:</h1>
            <h1 className='text-2xl'>{data.averageTraining}</h1>
            <h1 className="text-2xl">Deine Wettkampleistung:</h1>
            {competitionPlot}
            <h1 className='text-2xl'>Deine Trainingsergebnisse:</h1>
            {trainingsPlot}
            {notesTable}
            <h1 className='text-2xl'>Durchschnittliche Trainingszeit:</h1>
            <h1 className='text-2xl'>{data.averageTrainingTime} Minuten</h1>
            <h1 className='text-2xl'>Games won and lost:</h1>
            <h1 className='text-xl'>Games won: {data.gameResults[0]}%</h1>
            <h1 className='text-xl'>Games lost: {data.gameResults[1]}%</h1>
            <h1 className='text-xl'>Games drawen: {data.gameResults[2]}%</h1>
        </div>
    );
}

export default Statistics;
