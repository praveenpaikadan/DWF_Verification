import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'

export const CumulativeRainPlot = ({ allRGData, xArray, mainplotZoomIndex, activeRGID }) => {

    const cumulativeData = (array) => {
        var first = isNaN(array[0]) ? 0 : array[0] 
        var cumArray = [first]
        for(let i=1 ; i< array.length ; i++){
            var valueToAdd = isNaN(array[i]) ? 0 : array[i]
            cumArray.push(cumArray[i-1] + valueToAdd )
        }
        return cumArray
    }

    var createTraces = () => {
        var traces =  allRGData.map((item) => {
            var ydata = []
            for(var i = mainplotZoomIndex[0]; i <= mainplotZoomIndex[1]; i++){
                ydata.push(item.rain[i])
            }
            // console.log(ydata)
            var trace = {   
                x: xArray.slice(...mainplotZoomIndex),
                y: item.rain,
                y: cumulativeData(ydata),
                mode:"lines",
                name: item.identifier,
                line: {
                    width: item.identifier === activeRGID ? 3 : 1 
                }
            };
            return trace
        })
        return traces
    }

    // console.log(createTraces(allRGData,mainplotZoomIndex, activeRGID))

    const [plotState, setPlotState] = useState(
        {
            data: createTraces(),
            layout: {
                xaxis: {
                    // range: [0, xArray.length], 
                    title: "Time",
                    gridwidth: 1,
                    zeroline: true,
                    type: 'date',
                    showgrid: true,
                    linewidth: 1,
                    linecolor: 'rgba(0,0,0,0.3)',
                    gridcolor: 'rgba(0,0,0,0.2)',
                },

                yaxis: {
                    title: "Cumulative Rainfall (mm)",
                    linewidth: 1,
                    linecolor: 'rgba(0,0,0,0.3)',
                    gridcolor: 'rgba(0,0,0,0.2)',
                },

                // title: "Flow Survey",
                autosize: false,
                width: 500,
                height: 360,
                margin: {
                    l: 60,
                    r: 5,
                    b: 50,
                    t: 25,
                    pad: 2
                },
                font: {
                    size: 11,
                    // family: 'Courier New, monospace',
                    weight: '300'
                },
                paper_bgcolor: 'white',
                plot_bgcolor: 'white',
            },

            frames: [],
            config: {
                displaylogo: false,
                modeBarButtonsToRemove: ['select2d','lasso2d'],
                displayModeBar: true
            },
        }
    )

    useEffect(() => {
        var traces = createTraces(allRGData, mainplotZoomIndex, activeRGID ) 
        var oldState = {...plotState}

        oldState.data = traces
        setPlotState(oldState)
    }, [mainplotZoomIndex, activeRGID])

    
  return (
    <div style={{border: '0.5px solid rgba(0,0,0,0.1)'}}>
        <Plot
        // Define Data
            data = {plotState.data}
            layout={plotState.layout}
            frames={plotState.frames}
            config={plotState.config}
            onInitialized={(figure) =>{ 
                setPlotState(figure)
            }}
            onUpdate={(figure) => {
                setPlotState(figure); 
            }}
        />
</div>
  )
}
