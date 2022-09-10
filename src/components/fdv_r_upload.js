import React, { useEffect, useState } from 'react'
import { usePapaParse } from 'react-papaparse';
import { extractFDVData, extractRData, generateTimeSeriesDataFromStartEndTimeStamp, shiftBeginingWithNaN } from '../core-functions/cleanup_and_extraction';
import { arrayMinMax } from '../core-functions/data_converters';
import DragDropFileUpload from './drag-drop-file';

export const FDV_R_Upload = ({fullFSData, setFullFSData, setFullFinalTS}) => {

    const postParsingProcess = (FSData) => {
        // generating the xAxis that has to be the same for all the FMs
        let timesOfStart = FSData.map(item => item.startTimeStamp)
        let timesOfEnd = FSData.map(item => item.endTimeStamp)
        let intervel = FSData[0].intervel    
        let [startTime, endTime] = arrayMinMax([...timesOfStart, ...timesOfEnd])
        setFullFinalTS(generateTimeSeriesDataFromStartEndTimeStamp(startTime, endTime, intervel))

        // Balancing Start time
        for(let i = 0; i< FSData.length ; i++){
            let monitorData = FSData[i]
            let fields = monitorData.type === "FDV" ?  ["depth", "flow", "velocity"] : ["rain"]

            // console.log(monitorData, fields)

            for(let param of fields){
                // FSData[i]["unAdjusted_" + param] = monitorData[param] 
                FSData[i][param] = shiftBeginingWithNaN(monitorData[param], startTime, monitorData.startTimeStamp, monitorData.intervel) 
            }
        }

        return FSData
    }
    
    const { readString } = usePapaParse();
    
    const extractAndSaveData = (files) => {

        // create native js file reader object

        var totalValidFiles = 0
        var fullData = []
        
        for(let i = 0; i < files.length ; i++){
            let file = files[i]
            let filename = file.name.toLowerCase()
            let type = null
            filename.includes(".fdv") ? type = "FDV" : type="R"  
            if(!type){
                continue
            }

            totalValidFiles++  
            
            // define file reader - individual file readers will read individual files at the same time
            let fr=new FileReader();
            fr.onload=function(){
                readString(fr.result, {
                    worker: true,
                    complete: (results) => {
                        // console.log(results)
                        let extracted = type === "FDV" ? extractFDVData(results["data"]) : extractRData(results["data"]) 
                        extracted.type = type
                        fullData.push(extracted)
                        // console.log(extracted)
                        if(fullData.length === totalValidFiles){
                            let FSData = postParsingProcess(fullData)
                            setFullFSData(FSData)
                        }
                    },
                });
            }

            fr.readAsText(files[i]);
        }         
    }

    return (
    <div>
        {/* <input type="file" multiple id="myfile" name="myfile" onChange={(e) => {extractAndSaveData(e.target.files)}}/> */}
        <div style={{margin: 10}}>
            <DragDropFileUpload extractAndSaveData={extractAndSaveData}/>
        </div>
        {/* <label>{fullFSData.length}</label> */}
    </div>
  )
}
