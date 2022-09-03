
import React from 'react'
import Plot from 'react-plotly.js';

export const MainPlot = ({xArray, fsData, yRange}) => {

    return (
        <div>
            <Plot
                // Define Data
            var data = {[
                {
                x: xArray,
                y: fsData,
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
                    title: "Flow Graph",
                    autosize: false,
                    width: 1080 *0.9,
                    height: 500,
                    margin: {
                    l: 100,
                    r: 10,
                    b: 200,
                    t: 50,
                    pad: 20
                    },
                    paper_bgcolor: 'white',
                    plot_bgcolor: 'white'
            }}
            />
        </div>
    )
}