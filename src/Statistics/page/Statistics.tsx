import React from 'react';
import User from "../../User/models/User";
import LinePlotWithErrorBars from "../components/LinePlotWithErrorBars";
import useStatisticsData from "../hooks/statisticsData";
import ErrorDisplay from "../../shared/components/ErrorDisplay";  // This needs to be imported when using charts

interface Props {
    user: User
}

function Statistics({user}: Props) {
    const [statsLoading, statsError, statsData] = useStatisticsData(user.id);

    if (statsLoading) {
        return <p>Loading...</p>
    }

    if (statsError || !statsData) {
        return <ErrorDisplay error={statsError}/>
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl">Deine Vogelschussleistungen</h1>
            <LinePlotWithErrorBars yTitle={"Treffer"} xTitle={"Datum"} dataPoints={statsData.birdShooterHits}/>
        </div>
    );
}

export default Statistics;
