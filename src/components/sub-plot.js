
import React from 'react'
import Plot from 'react-plotly.js';

export const SubPlot = ({xArray, yData, yRange, label}) => {

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
                    xaxis: {range: [0, xArray.length], title: "Time"},
                    yaxis: {range: [yRange[0], yRange[1]], title: "Flow(m3/s)"},
                    title: label,
                    autosize: false,
                    width: 300,
                    height: 200,
                    margin: {
                    l: 120,
                    r: 10,
                    b: 200,
                    t: 150,
                    pad: 20
                    },
                    paper_bgcolor: 'white',
                    plot_bgcolor: 'white'
            }}
            />
        </div>
    )
}