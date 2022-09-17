import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'

export const DVScatterPlot = ({ scatterData }) => {

    const [plotState, setPlotState] = useState(
        {
            data: [{
                x: scatterData.velocity,
                y: scatterData.depth,
                mode: 'markers',
                type: 'scatter',
                // name: 'Team B',
                marker: { size: 2, color: 'green' }
              }],
            layout: {
                xaxis: {
                    // range: [0, xArray.length], 
                    title: "Velocity (m/s)",
                    gridwidth: 1,
                    zeroline: true,
                    // type: 'date',
                    showgrid: true,
                    linewidth: 1,
                    linecolor: 'rgba(0,0,0,0.3)',
                    gridcolor: 'rgba(0,0,0,0.2)',
                },

                yaxis: {
                    title: "Depth (m)",
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
        var oldState = {...plotState}
        oldState.data = [{
            x: scatterData.velocity,
            y: scatterData.depth,
            mode: 'markers',
            type: 'scatter',
            // name: 'Team B',
            marker: { size: 2, color: 'green' }
          }]
        setPlotState(oldState)
    }, [scatterData])
    
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
