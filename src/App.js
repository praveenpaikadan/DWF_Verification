import './App.css';
import React, { useState } from 'react';
import { Header } from './components/header';
import {FM} from './wrappers/fm_dwf';
// import FM from './wrappers/my-table-backup';
import CSVReader from './components/csv-reader';
import { cleanFMData, extractSubData, extractWWGData } from './core-functions/cleanup_and_extraction';
import { FDV_R_Upload } from './components/fdv_r_upload';
import { LeftPanel } from './components/left-panel';
import DragDropFileUpload from './components/drag-drop-file';

function App() {

  const [FSData, setFSData] = useState([])
  const [SubData, setSubData] = useState(null)
  const [WWGData, setWWGData] = useState(null)
  const [TFGData, setTFGData] = useState(null)
  // const [rawLinksData, setrawLinksData] = useState(null)

  const [fullFinalTS, setFullFinalTS] = useState(null)

  return (
    <div className="App">
      <Header />
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
        <FDV_R_Upload fullFSData={FSData} setFullFSData={setFSData} setFullFinalTS={setFullFinalTS}/>
        <CSVReader setData={setFSData} label={"FS Data"} parser={cleanFMData}/>
        <CSVReader setData={setSubData} label={"exported Sub Data"} parser={extractSubData}/>
        {/* <CSVReader setData={setrawLinksData} label={"exported FM Links Data"}/> */}
        <CSVReader setData={setWWGData} label={"exported WWG Data"} parser={extractWWGData}/>
        <CSVReader setData={setTFGData} label={"exported TWG Data"} parser={extractWWGData}/>
      
      </div>
      
      {FSData.length > 0 && 
        <FM 
          FSData={FSData} 
          subData={SubData} 
          WWGData={WWGData} 
          TFGData={TFGData}
          fullFinalTS={fullFinalTS}
        />}
    </div>
  );
}

export default App;
