import React, { useState, useEffect } from 'react';
import { MainPlot } from '../components/main-plot';
import { RightTabs } from '../components/right-panel';
import { Table } from '../components/table';
import { getSCValuesAsArrayForTable } from '../core-functions/data_converters';

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

return (
    <div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{flex: 1}}>
                <MainPlot xArray={xArray} fsData={fsData} yRange={arrayMinMax(fsData)}/> 
            </div>
            <div style={{flex: 1}}>

                <RightTabs 
                    fullSCTable=
                    {subcatchmentTable && 
                        <Table 
                            heading="All Subcatchments" 
                            column_headers={Object.keys(subData[0])}
                            row_headers={subData.map((item) => "" )}
                            dataObjectArray={subcatchmentTable}
                            valueTypeByColumn={ Object.keys(subData[0]).map((item) => ["subcatchment_id", "FM"].includes(item) ? "text" : "number" )}
                            updateTable={updateTable}
                            tableDimension={[850, 500]}
                        />}


                    // exclusiveUsScTable={subcatchmentTable && 
                    //     <Table 
                    //         heading="All Subcatchments" 
                    //         column_headers={Object.keys(subData[0])}
                    //         row_headers={subData.map((item) => "" )}
                    //         values={subcatchmentTable}
                    //         valueTypeByColumn={ Object.keys(subData[0]).map((item) => ["subcatchment_id", "FM"].includes(item) ? "text" : "number" )}
                    //         setValues={setSubcatchmentTable}
                    //         tableDimension={[850, 500]}
                    //     />}

                    // fullUsScTable={subcatchmentTable && 
                    //     <Table 
                    //         heading="All Subcatchments" 
                    //         column_headers={Object.keys(subData[0])}
                    //         row_headers={subData.map((item) => "" )}
                    //         values={subcatchmentTable}
                    //         valueTypeByColumn={ Object.keys(subData[0]).map((item) => ["subcatchment_id", "FM"].includes(item) ? "text" : "number" )}
                    //         setValues={setSubcatchmentTable}
                    //         tableDimension={[850, 500]}
                    //     />}
                />

                <div className='subcatchment-table'>
                    
                </div>
            </div>
        </div>
    </div>
);
}

export default FM;
