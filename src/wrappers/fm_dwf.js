import React, { useState, useEffect } from 'react';
import { MainPlot } from '../components/main-plot';
import { ReactTable } from '../components/react-table';
import { RWTable } from '../components/react-window-table';
import { RightTabs } from '../components/right-panel';


const CELL_WIDTH = 75
const CELL_HEIGHT = 20
const COLUMN_HEADER_HEIGHT = 20
const ROW_HEADER_WIDTH = 100

function FM({xArray, fsData, subData, WWGData, TFGData, FMID}) {
    const arrayMinMax = (arr) =>
        arr.reduce(([min, max], val) => [Math.min(min, val), Math.max(max, val)], [
        Number.POSITIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
    ]);

    const usFMs = ["FM001"]

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

return (
    <div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{flex: 1}}>
                <MainPlot xArray={xArray} fsData={fsData} yRange={arrayMinMax(fsData)}/> 
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

export default FM;
