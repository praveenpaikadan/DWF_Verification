import React, {useState, useEffect} from 'react'
import { shiftBeginingWithNaN } from '../core-functions/cleanup_and_extraction'
import { MainPlot } from './main-plot'

export const LeftPanel = ({FSData, activeFMID, activeRGID, fullFinalTS, pipeDia}) => { 
  
    // const [activeRGID, setActiveRGID] = useState("R01")
    // console.log(activeFMID, activeRGID)
    var FMData = FSData.find(item => item.identifier === activeFMID)
    var RGData = FSData.find(item => item.identifier === activeRGID)
    
    if(FSData === []){
        return <label>No Data</label>
    }

    return (
        <div>
            <div>
            </div>
            <MainPlot xArray={fullFinalTS} RGData={RGData} FMData={FMData} label={activeFMID} pipeDia={pipeDia}/>
        </div>
        )

}
