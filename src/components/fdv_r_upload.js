import React from 'react'
import { usePapaParse } from 'react-papaparse';
import { extractFDVData } from '../core-functions/cleanup_and_extraction';

export const FDV_R_Upload = () => {
  
    const { readString } = usePapaParse();

    const convertToArray = (text) => { 
        readString(text, {
            worker: true,
            complete: (results) => {
                console.log('---------------------------');
                console.log(results["data"]);
                extractFDVData(results["data"])
                console.log('---------------------------');
            },
        });

    }
    
    const convertToText = (file) => {         
        var fr=new FileReader();
        fr.onload=function(){
            convertToArray(fr.result);
        }
        fr.readAsText(file);
    }

  
    return (
    <div>
        <input type="file" multiple id="myfile" name="myfile" onChange={(e) => {convertToText(e.target.files[0])}}/>

    </div>
  )
}
