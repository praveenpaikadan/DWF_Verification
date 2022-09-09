
import React, {useEffect, useState} from 'react'
import Plot from 'react-plotly.js';

export const MainPlot = ({xArray, RGData, FMData, label}) => {

    // console.log(xArray, RGData, FMData, label)

    const [rainBar, setRainBar] = useState(false)
    var trace1 = {
        x: xArray,
        y: FMData.velocity,
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
        y: FMData.flow,
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
        y: FMData.depth,
        mode:"lines",
        name: "Depth",
        yaxis: 'y3',
        line: {
            color: 'green',
            width: 1.5
        }
      };

      var trace4 = {
        x: xArray,
        y: RGData.rain,
        type: 'bar',
        name: "Rain",
        yaxis: 'y4',
        marker: {
            color: 'blue',
            // width: 1.5
        }
      };
      
      const [plotState, setPlotState] = useState(
        {
            data:  [trace1, trace2, trace3, trace4],
            layout: {
                xaxis: {
                    // range: [0, xArray.length], 
                    title: "Time",
                    gridwidth: 1,
                },
                title: "Flow Survey",
                autosize: false,
                width: 1080 *0.9,
                height: 690,
                margin: {
                    l: 90,
                    r: 10,
                    b: 200,
                    t: 50,
                    pad: 20
                },
                paper_bgcolor: 'white',
                plot_bgcolor: 'white',
                showlegend: false,
            
                yaxis: {title: "Velocity(m/s)",domain: [0, 0.25]},
                yaxis2: {title: "Flow(m3/s)", domain: [0.25, 0.5]},
                yaxis3: {title: "Depth(m)", domain: [0.5, 0.75]},
                yaxis4: {title: "Rain(mmhr)", domain: [0.75, 1]}
            },

            frames: [],
            config: {
                displaylogo: false,
                modeBarButtonsToRemove: ['select2d','lasso2d']
            },
        }
    )
      
    useEffect(() => {
        // console.log("executed", FMData.identifier, RGData.identifier)
        var trace1 = {
            x: xArray,
            y: FMData.velocity,
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
            y: FMData.flow,
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
            y: FMData.depth,
            mode:"lines",
            name: "Depth",
            yaxis: 'y3',
            line: {
                color: 'green',
                width: 1.5
            }
          };
    
          var trace4 = {
            x: xArray,
            y: RGData.rain,
            type: rainBar?'bar':'line',
            name: "Rain",
            yaxis: 'y4',
            marker: {
                color: 'blue',
                // width: 1.5
            }
          };

        var oldState = {...plotState}
        oldState.data = [trace1, trace2, trace3, trace4]
        setPlotState(oldState)
    }, [RGData, FMData, rainBar])


    return (
        <div>
            {/* <div>
                <button>Flow</button>
                <button>Depth</button>
                <button>v</button>
            </div> */}
            <div style={{zIndex: 100, display: 'flex', flexDirection: 'row', position:'relative', top: 45, left: 80}}>
                <input type={"checkbox"} checked={rainBar} onChange={(e) => {setRainBar(e.target.checked)}}/>
                <label style={{fontSize: 14}}>show rain as bar chart</label>
            </div>
            
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