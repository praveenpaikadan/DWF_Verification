
import React, {useState} from 'react'
import Plot from 'react-plotly.js';

export const MainPlot = ({xArray, fsData, yRange, label}) => {

    var trace1 = {
        x: xArray,
        y: fsData,
        yaxis: 'y',
        mode:"lines",
        name: "Velocity",
        line: {
            color: 'green',
            width: 1.5
        }
      };
      
      var trace2 = {
        x: xArray,
        y: fsData,
        yaxis: 'y2',
        mode:"lines",
        name: "Flow",
        line: {
            color: 'green',
            width: 1.5
        }
      };

      var trace3 = {
        x: xArray,
        y: fsData,
        mode:"lines",
        name: "Depth",
        yaxis: 'y3',
        line: {
            color: 'green',
            width: 1.5
        }
      };
      
     

    const [plotState, setPlotState] = useState(
        {
            data:  [trace1, trace2, trace3],
            layout: {
                xaxis: {range: [0, xArray.length], title: "Time"},
                title: "Flow Survey",
                autosize: false,
                width: 1080 *0.9,
                height: 690,
                margin: {
                    l: 100,
                    r: 10,
                    b: 200,
                    t: 50,
                    pad: 20
                },
                paper_bgcolor: 'white',
                plot_bgcolor: 'white',
                showlegend: false,
                yaxis: {title: "Velocity(m/s)",domain: [0, 0.31]},
                yaxis2: {title: "Flow(m3/s)", domain: [0.33, 0.64]},
                yaxis3: {title: "Depth(m)", domain: [0.66, 0.98]}
            },

            frames: [],
            config: {}
        }
    )
 

    return (
        <div>
            {/* <div>
                <button>Flow</button>
                <button>Depth</button>
                <button>v</button>
            </div> */}
            <Plot
                // Define Data
                data = {plotState.data}
                layout={plotState.layout}
                frames={plotState.frames}
                config={plotState.config}
                onInitialized={(figure) => setPlotState(figure)}
                onUpdate={(figure) => setPlotState(figure) }
            />
            
        </div>
    )
}