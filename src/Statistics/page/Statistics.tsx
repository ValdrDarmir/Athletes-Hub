import React from 'react';
import User from "../../App/models/User";
import LinePlotWithErrorBars from "../components/LinePlotWithErrorBars";
import useStatisticsData from "../hooks/statisticsData";  // This needs to be imported when using charts

interface Props {
    user: User
}

function Statistics({user}: Props) {
    const [statsLoading, statsError, statsData] = useStatisticsData(user.id);

    if (statsLoading) {
        return <p>Loading...</p>
    }

    if (statsError || !statsData) {
        const unknownError = new Error("Unknown error happened") // This should not happen
        const error = statsError || unknownError
        return <p>Error: {(error || unknownError).message}</p>
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl">Deine Vogelschussleistungen</h1>
            <LinePlotWithErrorBars yTitle={"Treffer"} xTitle={"Datum"} dataPoints={statsData.birdShooterHits}/>
        </div>
    );
}

export default Statistics;
