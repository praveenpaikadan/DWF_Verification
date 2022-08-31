import './App.css';
import React, { useState } from 'react';
import { Header } from './components/header';
import FM from './wrappers/fm_dwf';
import CSVReader from './components/uploder';
import { cleanFMData, extractSubData, extractWWGData } from './core-functions/cleanup_and_extraction';

function App() {

  const [rawFSData, setrawFSData] = useState(null)
  const [rawSubData, setrawSubData] = useState(null)
  const [rawLinksData, setrawLinksData] = useState(null)
  const [rawWWGData, setrawWWGData] = useState(null)
  const [rawTFGData, setrawTFGData] = useState(null)

  if(rawFSData){
    var cleanedFMData = cleanFMData(rawFSData)
  }

  if(rawSubData){
    var extractedSubData = extractSubData(rawSubData)
  }

  if(rawWWGData){
    var extractedWWGData = extractWWGData(rawWWGData)
  }

  if(rawTFGData){
    var extractedTFGData = extractWWGData(rawTFGData)
  }
 
  var FMIndex = 1

  return (
    <div className="App">
      <Header />
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
        <CSVReader setData={setrawFSData} label={"FS Data"}/>
        <CSVReader setData={setrawSubData} label={"exported Sub Data"}/>
        <CSVReader setData={setrawLinksData} label={"exported FM Links Data"}/>
        <CSVReader setData={setrawWWGData} label={"exported WWG Data"}/>
        <CSVReader setData={setrawTFGData} label={"exported TWG Data"}/>
      </div>
      {rawFSData && <FM index={FMIndex} xArray={cleanedFMData.ts} fsData={cleanedFMData.values} subData={extractedSubData}/>}
    </div>
  );
}

export default App;
