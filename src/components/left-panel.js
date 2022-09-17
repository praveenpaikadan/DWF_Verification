import React, {useState, useEffect} from 'react'
import { shiftBeginingWithNaN } from '../core-functions/cleanup_and_extraction'
import { CumulativeRainPlot } from './cumulative-rain'
import { DVScatterPlot } from './dv-scatterplot'
import { MainPlot } from './main-plot'

export const LeftPanel = ({FSData, activeFMID, activeRGID, fullFinalTS, pipeDia}) => { 
  
    const [mainplotZoomIndex, setMainPlotZoomIndex] = useState([0,0])  // this state will bear the index of starting end and ending end data in main plot
    var FMData = FSData.find(item => item.identifier === activeFMID)
    var RGData = FSData.find(item => item.identifier === activeRGID)
    // console.log(FSData)
    const [scatterData, setScatterData] = useState({depth: [], velocity: []})
    const [cumPlotDisplay, setCumPlotDisplay] = useState(true)
    const [scatterPlotDisplay, setScatterPlotDisplay] = useState(true)

    const toggleCumPlot = () => {setCumPlotDisplay(!cumPlotDisplay)}
    const toggleScatterPlot = () => {setScatterPlotDisplay(!scatterPlotDisplay)}


    if(FSData === []){
        return <label>No Data</label>
    }

    return (
        <div style={{display: 'flex', flexDirection: 'row', justifyContent:'center'}}>
            <MainPlot 
                xArray={fullFinalTS} 
                RGData={RGData} 
                FMData={FMData} 
                label={activeFMID} 
                pipeDia={pipeDia}
                setMainPlotZoomIndex={setMainPlotZoomIndex}
                setScatterData={setScatterData}
                toggleCumPlot={toggleCumPlot}
                toggleScatterPlot={toggleScatterPlot}
            />
            <div style={{display: 'flex', alignItems: 'flex-start', flexDirection: 'column', justifyContent:'center'}}>   
                {cumPlotDisplay ? 
                <CumulativeRainPlot 
                    xArray={fullFinalTS} 
                    allRGData={FSData.filter(item=>item.type==="R")}
                    mainplotZoomIndex={mainplotZoomIndex}
                    activeRGID={activeRGID}
                    /> : null}
                {scatterPlotDisplay ? <DVScatterPlot 
                   scatterData={scatterData}
                />: null}
            </div>
            
        </div>
        )

}
