
import React, {useEffect, useState} from 'react'
import Plot from 'react-plotly.js';

export const MainPlot = ({xArray, RGData, FMData, label, pipeDia}) => {

    // console.log(xArray, RGData, FMData, label)

    const [rainBar, setRainBar] = useState(false)
    const [surchargeLevel, setSurchargeLevel] = useState(false)

    // axis locks
    var fields = ["depth", "flow", "velocity", "rain"]
    var axes = ["yaxis3", "yaxis2", "yaxis", "yaxis4"]
    var locks = fields.map((field, j) => {return {field: field, axis: axes[j],locked: false, bounds: ["", ""]}})
    const [axisLocks, setAxisLocks] = useState(locks)

    const updateLockStatus = (index, status) => {
        let old = [...axisLocks]
        old[index]["locked"] = status
        setAxisLocks(old)
    } 

    const updateLockBounds = (index, upperOrLower, value) => {
        let old = [...axisLocks]
        old[index]["bounds"][upperOrLower] = value
        setAxisLocks(old)
    }

    const returnSameArrayButWithZeroAt0 = (arrayData) => {  // to always display zero line
        arrayData[0] = 0
        return arrayData
    }

    const createFDVTraces = (xArray, FMData) => {
        var trace1 = {
            x: xArray,
            y: returnSameArrayButWithZeroAt0(FMData.velocity),
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
            y: returnSameArrayButWithZeroAt0(FMData.flow),
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
            y: returnSameArrayButWithZeroAt0(FMData.depth),
            mode:"lines",
            name: "Depth",
            yaxis: 'y3',
            line: {
                color: 'green',
                width: 1.5
            }
          };

          return [trace1, trace2, trace3]
    }

    const createRTrace = (xArray, RGData, rAs) => {
        var trace4 = {
            x: xArray,
            y: RGData.rain,
            type: rAs,
            orientation: 'v2',
            name: "Rain",
            yaxis: 'y4',
            marker: {
                color: 'blue',
                // width: 1.5
            }
          };
        return [trace4]
    }

    const createSurchargeLevelTrace = (xArray, pipeDia, length) => {
        var trace5 = {    // surcharge Line
            x: xArray,
            y: Array(length).fill(pipeDia/1000),
            name: 'Pipe Dia',
            yaxis: 'y3',
            line: {
                color: 'red',
                width:1
            }
          }

          return [trace5]
    }

    const returnTraces = ({xArray, FMData, RGData, pipeDia, which, rAs}) => {
        let FDVTraces = FMData ? createFDVTraces(xArray, FMData) : []
        let RTaces =  RGData ? createRTrace(xArray, RGData, rAs) : []
        let surchargeLevelTrace = pipeDia && which.includes("S") ? createSurchargeLevelTrace(xArray, pipeDia, FMData.depth.length) : []
        return FDVTraces.concat(RTaces.concat(surchargeLevelTrace))
    }

    var intialTraces = returnTraces({xArray, FMData, RGData, pipeDia, which: ["FDV", "R", "S"], rAs: "line"})

    // console.log(intialTraces)

    const [plotState, setPlotState] = useState(
        {
            data: intialTraces,
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
                    title: "Velocity(m/s)",
                    domain: [0, 0.24],
                    linewidth: 1,
                    linecolor: 'rgba(0,0,0,0.3)',
                    gridcolor: 'rgba(0,0,0,0.2)',
                },
                yaxis2: {
                    title: "Flow(m3/s)", 
                    domain: [0.26, 0.49],
                    linewidth: 1,
                    linecolor: 'rgba(0,0,0,0.3)',
                    gridcolor: 'rgba(0,0,0,0.2)',
                },
                yaxis3: {
                    title: "Depth(m)", 
                    domain: [0.51, 0.74],
                    linewidth: 1,
                    linecolor: 'rgba(0,0,0,0.3)',
                    gridcolor: 'rgba(0,0,0,0.2)',
                },
                yaxis4: {
                    title: "Rain(mmhr)", 
                    domain: [0.76, 1],
                    linewidth: 1,
                    linecolor: 'rgba(0,0,0,0.3)',
                    gridcolor: 'rgba(0,0,0,0.2)',
                },

                // title: "Flow Survey",
                autosize: false,
                width: 1080 *0.9,
                height: 690,
                margin: {
                    l: 60,
                    r: 10,
                    b: 150,
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
                showlegend: false,
            },

            frames: [],
            config: {
                displaylogo: false,
                modeBarButtonsToRemove: ['select2d','lasso2d'],
                displayModeBar: true
            },
        }
    )
      
    const lockX = () => {
        var oldState = {...plotState}
        oldState.layout["xaxis"].autorange = false
        setPlotState(oldState)
    } 

    useEffect(() => {
        var traces = returnTraces({xArray, FMData, RGData, pipeDia, which: ["FDV", "R", surchargeLevel ? "S" : null], rAs: rainBar ? "bar" : "line"})
        var oldState = {...plotState}
        oldState.data = traces

        // locking y
        for(var i = 0; i< axisLocks.length; i++){
            if(axisLocks[i].locked === true){
                oldState.layout[axisLocks[i]["axis"]].range = axisLocks[i]["bounds"]
                oldState.layout[axisLocks[i]["axis"]].autorange = false


            }else{
                delete oldState.layout[axisLocks[i]["axis"]].range
                oldState.layout[axisLocks[i]["axis"]].autorange = true
            }
        }
        setPlotState(oldState)
    }, [RGData, FMData, rainBar, pipeDia, surchargeLevel, axisLocks])

    
    return (
        <div>
            <div>
                <div style={{zIndex: 100, display: 'flex', flexDirection: 'row', position:'relative', top: 5, left: 80, justifyContent:'space-between'}}>
                    <div style={{ display: 'flex', flexDirection: 'row'}}>
                        <div style={{width: 330, display: 'flex'}}>
                            <input type={"checkbox"} checked={surchargeLevel} onChange={(e) => {setSurchargeLevel(e.target.checked)}}/>
                            <label style={{fontSize: 12}}>Display surcharge level</label>
                        </div>
                        <div style={{width: 330, display: 'flex'}}>
                            <input type={"checkbox"} checked={rainBar} onChange={(e) => {setRainBar(e.target.checked)}}/>
                            <label style={{fontSize: 12}}>Show rain as bar chart</label>
                        </div>
                    </div>    
                    <div style={{width: 300, display: 'flex'}}>
                        <button onClick={() => {lockX()}} style={styles.lockX}>Lock time axis in current view</button>
                    </div>
                </div>

                <div style={{zIndex: 101, display: 'flex', flexDirection: 'row', position:'relative', top: 5, left: 80, flexWrap:'wrap', width: 750}}>
                    {axisLocks.map((item, index) => 
                            <div style={{width: 300, display: 'flex', justifyContent:'space-between', alignItems:'center', marginRight: 30}} key={String(index)}>
                                <span>
                                    <input type={"checkbox"} checked={item.locked} onChange={(e) => {updateLockStatus(index, e.target.checked)}}/>
                                    <label style={{...styles.axisControlText}}>Lock {item.field} axis between </label>
                                </span>
                                <span style={{}}> 
                                    <input type="number" value={item.bounds[0]} onChange={(e) => {updateLockBounds(index, 0, e.target.value)}} style={styles.minMaxInput} /> 
                                    <label style={styles.axisControlText}> and </label>
                                    <input type="number" value={item.bounds[1]} onChange={(e) => {updateLockBounds(index, 1, e.target.value)}} style={styles.minMaxInput} />
                                </span>
                            </div>
                        )}
                </div>
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


const styles = {
    minMaxInput: {
        width: 50,
        height: 15,
        border: 'none',
        borderBottom: '2px solid rgba(0,0,0,0.3)',
        fontSize: 10,
        backgroundColor: 'rgba(0,0,0,0.05)'
    },
    axisControlText: {
        fontSize: 12
    },
    lockX: {
        fontSize: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
        border: "0.5px solid rgba(0,0,0,0.1)",
        borderRadius: 5,
        color: 'rgba(0,0,0,0.8)'
    },
}