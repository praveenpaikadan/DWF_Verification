import React, { useState, useEffect } from 'react';
import { LeftPanel } from '../components/left-panel';
import { MainPlot } from '../components/main-plot';
import { ReactTable } from '../components/react-table';
import { RWTable } from '../components/react-window-table';
import { RightTabs } from '../components/right-panel';
import { Scroller } from '../components/scroller';
import { generateTimeSeriesDataFromStartEndTimeStamp, shiftBeginingWithNaN } from '../core-functions/cleanup_and_extraction';
import { arrayMinMax, sortArrayBasedOnString } from '../core-functions/data_converters';


const CELL_WIDTH = 75
const CELL_HEIGHT = 20
const COLUMN_HEADER_HEIGHT = 20
const ROW_HEADER_WIDTH = 100

export const FM = ({FSData, subData, WWGData, TFGData, fullFinalTS}) => {
    // control of which FMID is active

    const [RGIDs, setRGIDs] = useState(null)
    const [FMIDs, setFMIDs] = useState(null)

    const [activeFMID, setActiveFMID] = useState(null)
    const [activeRGID, setActiveRGID] = useState(null)
    const [displayMetaData, setDisplayMetaData] = useState(null)

    useEffect(() => {
        // sorting FS Data based on identifier name 
        FSData = FSData.length > 0 ? FSData = sortArrayBasedOnString(FSData, "identifier") : FSData
        // var identifiers = FSData.map(item => item.identifiers)

        // setting RGID and FMID list
        var a = []
        var b = []
        FSData.forEach((element, index) => {
            if(element.type === "FDV"){
                a.push(element.identifier)
            }else{
                b.push(element.identifier)
            }
        });

        // console.log(a, b)
        setFMIDs(a)
        setRGIDs(b)
        setActiveFMID(a[0])
        setActiveRGID(b[0])
    }, FSData)
    
    useEffect(() => {
        subData && setSubcatchmentTable(subData)
    }, [subData])

    const [subcatchmentTable, setSubcatchmentTable] = useState(null) // this is an aa=rray of object. 
    const updateTable = (sub_id, field, value) => {
        var oldTable = [...subcatchmentTable]
        for(var i = 0; i < oldTable.length; i++){
            if(subcatchmentTable[i]["subcatchment_id"] === sub_id){
                oldTable[i][field] = value 
            }
        }
        setSubcatchmentTable(oldTable)
    }

    const createColumnHeaderDataForReactTable = (column_headers) => {
        column_headers.pop()
        return column_headers.map(item => {
            return{
                name: item, 
                selector: row => row[item], sortable: true,
                cell: (row, index, column, id) => {
                    var field = column.name
                    var sub_id = row["subcatchment_id"] 
                    var value = row[column.name]
                    return(
                        <div style={{width: CELL_WIDTH }}>
                            <input style={{width: CELL_WIDTH + 20 , border: '1px rgba(0,0,0,0.3) solid' }} value={value} onChange={(e) => {updateTable(sub_id, field, e.target.value)}}/>
                        </div>
                        )
                }
        } })
    }
    
    if(!fullFinalTS || !activeFMID || !activeRGID) {
        return <label>Loading ...</label>
    }

    return (
        <div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                
                <div style={{flex: 1}}> 
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between', alignItems: 'center'}}>
                        <Scroller values={FMIDs} value={activeFMID} setValue={setActiveFMID} label={"FM ID"}/>
                        <label>{displayMetaData}</label>
                        <Scroller values={RGIDs} value={activeRGID} setValue={setActiveRGID} label={"RGID"}/>
                    </div>
                    <LeftPanel 
                        FSData={FSData}  
                        setActiveFMID={setActiveFMID}
                        fullFinalTS={fullFinalTS}
                        activeFMID={activeFMID}
                        activeRGID={activeRGID}
                        setDisplayMetaData={setDisplayMetaData}
                    />
                </div>

                <div style={{flex: 1}}>
                    <RightTabs 
                        fullSCTable={subcatchmentTable &&   
                            <RWTable 
                                columns={Object.keys(subcatchmentTable[0])}
                                data={subcatchmentTable}
                                dataType={Object.keys(subcatchmentTable[0]).map((item) => ["subcatchment_id", "FM"].includes(item) ? "text" : "number" )}
                                updateTable={updateTable}
                                tableDimension={[800, 400]}
                            />
                        
                        // <ReactTable 
                        //     columns={createColumnHeaderDataForReactTable(Object.keys(subData[0]))}
                        //     data={subcatchmentTable.map((item) => {item.id = item["subcatchment_id"]; return item })} 
                        //     dimensions={[500, 400]}
                        //     cellDimensions={[CELL_WIDTH, CELL_HEIGHT]}
                        // />
                    
                        }

                        WWGData={WWGData}
                        TFGData={TFGData}
                    />  
                    <div className='subcatchment-table'>
                        
                    </div>
                </div>
            </div>
        </div>
);
}
