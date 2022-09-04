import './App.css';
import React, { useState } from 'react';
import { Header } from './components/header';
import FM from './wrappers/fm_dwf';
// import FM from './wrappers/my-table-backup';
import CSVReader from './components/csv-reader';
import { cleanFMData, extractSubData, extractWWGData } from './core-functions/cleanup_and_extraction';
import { FDV_R_Upload } from './components/fdv_r_upload';

function App() {

  const [FSData, setFSData] = useState(null)
  const [SubData, setSubData] = useState(null)
  // const [rawLinksData, setrawLinksData] = useState(null)
  const [WWGData, setWWGData] = useState(null)
  const [TFGData, setTFGData] = useState(null)
 
  var FMID = "FM001"

  return (
    <div className="App">
      <Header />
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
        <FDV_R_Upload />
        <CSVReader setData={setFSData} label={"FS Data"} parser={cleanFMData}/>
        <CSVReader setData={setSubData} label={"exported Sub Data"} parser={extractSubData}/>
        {/* <CSVReader setData={setrawLinksData} label={"exported FM Links Data"}/> */}
        <CSVReader setData={setWWGData} label={"exported WWG Data"} parser={extractWWGData}/>
        <CSVReader setData={setTFGData} label={"exported TWG Data"} parser={extractWWGData}/>
      </div>
      
      {FSData && 
      <FM 
        FMID={FMID}
        xArray={FSData.ts} 
        fsData={FSData.values} 
        subData={SubData}
        WWGData={WWGData}
        TFGData={TFGData}
        />}
    </div>
  );
}

export default App;
