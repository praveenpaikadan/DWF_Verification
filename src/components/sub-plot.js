
import React from 'react'
import Plot from 'react-plotly.js';
import { arrayMinMax } from '../core-functions/data_converters';

export const SubPlot = ({xArray, yData, yRange, label}) => {

    if(!yRange){
        yRange=arrayMinMax(yData)
        yRange[0] = arrayMinMax[0, yRange[0]]
    }

    return (
        <div>
            <Plot
                // Define Data
            var data = {[
                {
                x: xArray,
                y: yData,
                mode:"lines",
                name: "Observed",
                line: {
                    color: 'green',
                    width: 2
                }
                },
                ]}
            
                layout={ {
                    xaxis: {range: [0, xArray.length], title: "Hours"},
                    yaxis: {range: [yRange[0], yRange[1]], title: "Factor"},
                    title: label,
                    autosize: false,
                    width: 520,
                    height: 300,
                    margin: {
                    l: 100,
                    r: 20,
                    b: 100,
                    t: 100,
                    pad: 20
                    },
                    paper_bgcolor: 'white',
                    plot_bgcolor: 'white'
            }}
            />
        </div>
    )
}