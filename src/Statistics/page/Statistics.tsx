import React, { useCallback} from 'react';
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
    const [, setDate, setDateEnd, setSelectedDiscipline, getFilteredData] = useFilterData(START_DATE, CURRENT_DATE, INITIAL_DISCIPLINE);

    const data = getFilteredData(statsData?.data[0], statsData?.data[1])

    const createTrainingsNotes = useCallback((data: any) => {
        var constructNotesTable = [];
        var notes = []
        if(data.trainingsNotes === null){
            return
        }
        for (let i = 0; i < data.trainingsNotes.length; i++) {
            notes.push(
                <tr key={`note-${i}`}>
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
        if(date === null){
            return;
        }
        setDate(date)
    }, [setDate])

    const setEndDate = useCallback((date: Date | null) => {
        if(date === null){
            return;
        }
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
        <div className="flex flex-col items-center text-center m-4 gap-2">
            <div className="divider">Filter</div>
            <div className="form-control w-full">
                <label className="label"><span className="label-text">Disziplin</span></label>
                <select className="select select-bordered" onChange={event => disciplineChanged(event.target.value.toString())} defaultValue={INITIAL_DISCIPLINE}>
                    <option value={Disciplines.AirRifle}>{disciplineNames[Disciplines.AirRifle]}</option>
                    <option value={Disciplines.Pistol}>{disciplineNames[Disciplines.Pistol]}</option>
                </select>
            </div>
            <div className="flex justify-between gap-2 w-full">
                <div className="form-control">
                    <label className="label"><span className="label-text">Start Date</span></label>
                    <input className="input input-bordered" onChange={event => setStartDate(event.target.valueAsDate)} type="date" defaultValue={START_DATE.toISOString().split('T')[0]}/>
                </div>
                <div className="form-control">
                    <label className="label"><span className="label-text">End Date</span></label>
                    <input className="input input-bordered" onChange={event => setEndDate(event.target.valueAsDate)} type="date" defaultValue={CURRENT_DATE.toISOString().split('T')[0]}/>
                </div>
            </div>

            <div className="divider">Analyse</div>

            <div className="divider divider-sm">Seriendurchschnitt</div>

            <p className='text-xl'>Wettkampf: {data.averageCompetition}</p>
            <p className='text-xl'>Training: {data.averageTraining}</p>

            <div className="divider divider-sm">Deine Wettkampleistung</div>
            {competitionPlot}

            <div className="divider divider-sm">Deine Trainingsergebnisse</div>
            {trainingsPlot}

            <div className="divider divider-sm">Aktuelle Trainingsnotizen</div>
            {notesTable}

            <div className="divider divider-sm">Durchschnittliche Trainingszeit</div>
            <p className='text-xl'>{data.averageTrainingTime} Minuten</p>

            <div className="divider divider-sm">Schießspiel-Statistiken</div>
            <p className='text-xl'>Gewonnene Spiele: {Math.round(data.gameResults[0])}%</p>
            <p className='text-xl'>Verlorene Spiele: {Math.round(data.gameResults[1])}%</p>
            <p className='text-xl'>Unentschieden: {Math.round(data.gameResults[2])}%</p>
        </div>
    );
}

export default Statistics;
