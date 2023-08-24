import React from 'react';
import {Chart} from "react-chartjs-2";
import moment from "moment/moment";
import extractThemeColorsFromDOM from "../../shared/utils/extractThemeColorsFromDOM";
import {Chart as ChartJS, ChartData, ChartOptions} from "chart.js";
import {LineWithErrorBarsController, PointWithErrorBar} from "chartjs-chart-error-bars";
import "chart.js/auto"; // This is needed to make the charts work

export interface DataPoint {
    date: Date
    y: number
    yMin: number
    yMax: number
}

interface Props {
    yTitle: string
    xTitle: string
    dataPoints: DataPoint[]
}


// Setup error bar charts
ChartJS.register(
    LineWithErrorBarsController,
    PointWithErrorBar,
);

function LinePlotWithErrorBars({xTitle, yTitle, dataPoints}: Props) {
    const theme = extractThemeColorsFromDOM();

    const options: ChartOptions<"lineWithErrorBars"> = {
        plugins: {
            legend: {
                display: false,
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: yTitle,
                }
            },
            x: {
                title: {
                    display: true,
                    text: xTitle,
                }
            },
        }
    };

    const labels = dataPoints
        .map(({date}) => moment(date)
            .format("MMM DD"))

    const data: ChartData<"lineWithErrorBars"> = {
        labels: labels,
        datasets: [{
            data: dataPoints,
            label: yTitle,
            borderColor: theme.primary,
            backgroundColor: theme.accent,
            tension: 0.1
        }]
    }

    return (
        <Chart type={"lineWithErrorBars"}
               options={options}
               data={data}/>
    );
}

export default LinePlotWithErrorBars;
