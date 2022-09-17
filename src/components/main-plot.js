
import React, {useEffect, useState} from 'react'
import Plot from 'react-plotly.js';
import { getTimeInDisplayFormat } from '../core-functions/cleanup_and_extraction';
import { arrayMinMax } from '../core-functions/data_converters';
import { CumulativeRainPlot } from './cumulative-rain';

export const MainPlot = ({xArray, RGData, FMData, label, pipeDia, setMainPlotZoomIndex, setScatterData, toggleCumPlot, toggleScatterPlot}) => {
    
    var interval = FMData ? FMData.interval : RGData.interval
    var orgStart = new Date(xArray[0])
    var orgEnd = new Date(xArray[xArray.length-1])

    // console.log(xArray, RGData, FMData, label)
    const [rainBar, setRainBar] = useState(false)
    const [surchargeLevel, setSurchargeLevel] = useState(false)
    const [xBounds, setXBouds] = useState([null, null])
    const [minMaxCumulative, setMinMaxCumulative] = useState({rain: [0,0], depth: [0,0], flow: [0,0],velocity: [0,0], volume: 0, rainDepth: 0})
    const [slideMode, setSlideMode] = useState(false)

    // axis locks
    var fields = ["depth", "flow", "velocity", "rain"]
    var axes = ["yaxis3", "yaxis2", "yaxis", "yaxis4"]
    var locks = fields.map((field, j) => {return {field: field, axis: axes[j],locked: false, bounds: ["", ""]}})
    const [axisLocks, setAxisLocks] = useState(locks)

    const roundDateTo2Mins = (date) => {
        var coeff = 1000 * 60 * interval;
        var date = new Date(date);
        return getTimeInDisplayFormat(new Date(Math.round(date.getTime() / coeff) * coeff))
    }

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
        var newArrayData = [...arrayData]
        newArrayData[0] = 0
        return newArrayData
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
            mode:"lines",
            type: rAs,
            name: "Rain",
            yaxis: 'y4',
          };
        if(rAs === "bar"){
            trace4["marker"] = {color: 'blue'}
        }else{
            trace4["line"] =  { color: 'blue'}
        }

        return [trace4,]
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

    const handleDragZoomChange = (newXBounds) => { 
        const sumOfItemsinArray = (array) => {
            // console.log(array)
            var sum = 0
            for(var i = 0; i<array.length; i++){
                if(array[i]){
                    sum = sum + array[i]
                }
            }
            return sum
        }

        const returnMinMax = (array) => {
            array = array.filter(item => !isNaN(item))
            var minMax = arrayMinMax(array)
            minMax = minMax.map(item =>  isFinite(item) ? item : "NA")
            return minMax
        }

        var a = roundDateTo2Mins(newXBounds[0])  // start data
        var b = roundDateTo2Mins(newXBounds[1])  // end date 

        var aIndex = xArray.findIndex(item => item === a)
        var bIndex = xArray.findIndex(item => item === b)

        if(aIndex === -1 || bIndex === -1){
            // console.log("Executed", a, b, orgStart, orgEnd)
            let p = new Date(a)
            var q = new Date(b)

            if(p < orgStart){aIndex = 0}
            if(q > orgEnd){bIndex = xArray.length}
            if(p > orgEnd){aIndex = 0; bIndex = 0}
            if(q < orgStart ){aIndex = 0; bIndex = 0}
        } 

        setMainPlotZoomIndex([aIndex, bIndex])

        if(RGData){
            var rain = RGData.rain

            var activeRainData = rain.slice(aIndex, bIndex > rain.length ? rain.length + 1 :  bIndex + 1)

            var rainMinMax = returnMinMax(activeRainData)

            var rainDepth = sumOfItemsinArray(activeRainData) / 60 * interval
        }else{
            var rainMinMax = ['NA', 'NA']   // Infinity to render as NA
            var rainDepth = 0
        }
        
        if(FMData){
            var depth = FMData.depth
            var flow = FMData.flow
            var velocity = FMData.velocity

            var activeDepthData = depth.slice(aIndex, bIndex > depth.length ? depth.length + 1 :  bIndex + 1)
            var activeFlowData = flow.slice(aIndex, bIndex > flow.length ? flow.length + 1 :  bIndex + 1)
            var activeVelocityData = velocity.slice(aIndex, bIndex > velocity.length ? velocity.length + 1 :  bIndex + 1)
        
            var depthMinMax = returnMinMax(activeDepthData) 
            var flowMinMax = returnMinMax(activeFlowData)
            var velocityMinMax = returnMinMax(activeVelocityData)
            var volume = sumOfItemsinArray(activeFlowData) * 60 * interval

        }else{
            var depthMinMax = ["NA", "NA"]
            var flowMinMax = ["NA", "NA"]
            var velocityMinMax = ["NA", "NA"]
            var volume = 0
        }
        
        setMinMaxCumulative({rain: rainMinMax, depth: depthMinMax, flow: flowMinMax, velocity: velocityMinMax, volume: volume, rainDepth: rainDepth})
        setScatterData({depth: activeDepthData, velocity: activeVelocityData})
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
                width: 1080,   // 1080
                height: 600,
                margin: {
                    l: 60,
                    r: 5,
                    b: 60,
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
        handleDragZoomChange(xBounds)
    }, [...xBounds, FMData, RGData])

    useEffect(() => {
        var traces = returnTraces({xArray, FMData, RGData, pipeDia, which: ["FDV", "R", surchargeLevel ? "S" : null], rAs: rainBar ? "bar" : "line"})
        var oldState = {...plotState}
        oldState.data = traces

        // slideModel toggling
        if(slideMode){
            oldState.layout.xaxis["rangeslider"] = {}
        }else{
            delete oldState.layout.xaxis["rangeslider"]
        }

        // locking y
        for(var i = 0; i< axisLocks.length; i++){
            if(axisLocks[i].locked === true){
                oldState.layout[axisLocks[i]["axis"]].range = [...axisLocks[i]["bounds"]]
                oldState.layout[axisLocks[i]["axis"]].autorange = false


            }else{
                delete oldState.layout[axisLocks[i]["axis"]].range
                oldState.layout[axisLocks[i]["axis"]].autorange = true
            }
        }
        setPlotState(oldState)
    }, [RGData, FMData, rainBar, pipeDia, surchargeLevel, axisLocks, slideMode])

    
    return (
        <div style={{border: '0.5px solid rgba(0,0,0,0.1)', padding: 10}}>
            <div style={{display: 'flex', flexDirection:'row'}}>
                <div style={{flex: 1}}>
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
                    <div style={{display: 'flex', flexDirection: 'row', alignItems:'flex-end', justifyContent:'space-evenly',marginTop: 10}}>
                        <button onClick={() => {lockX()}} style={styles.lockX}>Lock time axis in current view</button>
                        <button onClick={() => {setSlideMode(!slideMode)}} style={styles.lockX}>Toggle Slide Mode</button>
                        <button onClick={() => {toggleCumPlot()}} style={styles.lockX}>Toggle Cumulative Rainfall Plot</button>
                        <button onClick={() => {toggleScatterPlot()}} style={styles.lockX}>Toggle D-V Scatter Plot</button>
                    </div>
                </div>
            </div>

            <div>
                <Plot
                    // Define Data
                    data = {plotState.data}
                    layout={plotState.layout}
                    frames={plotState.frames}
                    config={plotState.config}
                    onInitialized={(figure) =>{ 
                        setPlotState(figure)
                        setXBouds(figure.layout.xaxis.range)
                    }}
                    onUpdate={(figure) => {
                        setPlotState(figure); 
                        setXBouds(figure.layout.xaxis.range)
                        // handleDragZoomChange(figure.layout.xaxis.range);
                    }}
                />
            </div>
            

            <table style={{width: '100%',...styles.table }}>
                <tr>
                    <th>Time Range</th>
                    <th>Total Rain Depth (mm)</th>
                    <th>Volume (m<sup>3</sup>)</th>
                </tr>
                <tr>
                    <td>{`${roundDateTo2Mins(xBounds[0])} - ${roundDateTo2Mins(xBounds[1])}`}</td>
                    <td>{minMaxCumulative.rainDepth.toFixed(3)}</td>
                    <td>{minMaxCumulative.volume.toFixed(3)}</td>
                </tr>
            </table>

            <table style={{width: '100%', ...styles.table,marginTop: 10}}>
                <tr>
                    <th></th>
                    <th>Rain (mmhr)</th>
                    <th>Depth (m)</th>
                    <th>Flow (m<sup>3</sup>/s)</th>
                    <th>Velocity (m/s)</th>
                </tr>
                    <th>Min</th>
                    <td>{minMaxCumulative.rain[0]}</td>
                    <td>{minMaxCumulative.depth[0]}</td>
                    <td>{minMaxCumulative.flow[0]}</td>
                    <td>{minMaxCumulative.velocity[0]}</td>
                <tr>
                    <th>Max</th>
                    <td>{minMaxCumulative.rain[1]}</td>
                    <td>{minMaxCumulative.depth[1]}</td>
                    <td>{minMaxCumulative.flow[1]}</td>
                    <td>{minMaxCumulative.velocity[1]}</td>
                </tr>
            </table>
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
        color: 'rgba(0,0,0,0.8)',
        margin: 5,
        padding: 3,
        paddingLeft: 10,
        paddingRight: 10
    },
    table: {
        border: '1px solid rgba(0,0,0,0.5)',
        borderCollapse:'collapse',
        // maxWidth: 800,
        margin: 'auto'
    }

}