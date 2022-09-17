import React, { useEffect, useState } from 'react'
import { usePapaParse } from 'react-papaparse';
import { extractFDVData, extractRData, generateTimeSeriesDataFromStartEndTimeStamp, shiftBeginingWithNaN } from '../core-functions/cleanup_and_extraction';
import { arrayMinMax } from '../core-functions/data_converters';
import DragDropFileUpload from './drag-drop-file';

export const FDV_R_Upload = ({setFullFSData, setFullFinalTS}) => {
    const [status, setStatus] = useState("")
    const postParsingProcess = (FSData) => {
        //unique marking
        // FSData = FSData.map((item, index) => {item.identifier = item.identifier +"_"+ String(index); return item})

        // generating the xAxis that has to be the same for all the FMsl
        let timesOfStart = FSData.map(item => item.startTimeStamp)
        let timesOfEnd = FSData.map(item => item.endTimeStamp)
        let interval = FSData[0].interval    
        let [startTime, endTime] = arrayMinMax([...timesOfStart, ...timesOfEnd])
        setFullFinalTS(generateTimeSeriesDataFromStartEndTimeStamp(startTime, endTime, interval))

        // Balancing Start time
        for(let i = 0; i< FSData.length ; i++){
            let monitorData = FSData[i]
            let fields = monitorData.type === "FDV" ?  ["depth", "flow", "velocity"] : ["rain"]

            // console.log(monitorData, fields)
            for(let param of fields){
                // FSData[i]["unAdjusted_" + param] = monitorData[param] 
                FSData[i][param] = shiftBeginingWithNaN(monitorData[param], startTime, monitorData.startTimeStamp, monitorData.interval) 
            }
        }

        // // pushing a dummy rg and FM object incase one is not present or to  be turned off
        // var dummyFM = {depth: [], flow: [], velocity: [], type: "FDV", identifier: '_No Data_', mhId: "N/A", pipeDia: 0}
        // var dummyRG = {rain: [0], type: "R", identifier: '_No Data_', mhId: "N/A"}
        // FSData.push(dummyFM)
        // FSData.push(dummyRG)

        return FSData
    }
    
    const { readString } = usePapaParse();

    // alternate to extractAndSaveData not used right now
    const extractAndSaveDataOneByOneReader = (files) => {
        const readmultifiles = (files, typeRef) =>  {
            var index = 0
            var fr = new FileReader();
            fr.onload = function(e) {  
                readString(fr.result, {
                    worker: true,
                    complete: (results) => {
                        // console.log(results)
                        let type = typeRef[index]
                        let extracted = type === "FDV" ? extractFDVData(results["data"]) : extractRData(results["data"]) 
                        extracted.type = type
                        fullData.push(extracted)
                        setStatus(`Parsed ${fullData.length}/${files.length} FDV/R files`)
                        // console.log(extracted)
                        if(fullData.length === validFiles.length){
                            setStatus("Complete Parsing! Processing")
                            let FSData = postParsingProcess(fullData)
                            setStatus("Setting State")
                            setFullFSData(FSData)
                            setTimeout(() => {setStatus(null)}, 200)
                        }else{
                            index = index + 1
                            readFile(index)
                        }
                    },
                }); 
            }

            const readFile = (index) => {
                if( index >= files.length ) return;
                var file = files[index];
                fr.readAsText(file)
            }

            readFile(index)
        }

        // create native js file reader object

        var fullData = []
        var validFiles = []
        var typeRef= []
        
        for(let i = 0; i < files.length ; i++){
            setStatus(`Checking file extensions ... (${i}/${files.length})`)
            let file = files[i]
            let filename = file.name.toLowerCase()
            let type = null
            filename.includes(".fdv") ? type = "FDV" : type="R"
            if(!type){
                continue
            }  
            validFiles.push(file)
            typeRef.push(type)
        }  

        readmultifiles(validFiles, typeRef)
    }

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
                        setStatus(`Parsed ${fullData.length}/${files.length} FDV/R files`)
                        // console.log(extracted)
                        if(fullData.length === totalValidFiles){
                            setStatus("Complete Parsing! Processing")
                            let FSData = postParsingProcess(fullData)
                            setStatus("Setting State")
                            setFullFSData(FSData)
                            setTimeout(() => {setStatus(null)}, 200)
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
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <DragDropFileUpload extractAndSaveData={extractAndSaveData}/>
                <label style={{fontSize: 12}}>{status}</label>
            </div>
        </div>
        {/* <label>{fullFSData.length}</label> */}
    </div>
  )
}
