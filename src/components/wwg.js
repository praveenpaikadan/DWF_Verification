import React, {useState} from 'react'
import { createTimeSeriesDataForWWGTable } from '../core-functions/data_converters'
import { RWTable } from './react-window-table'
import { SubPlot } from './sub-plot'

export const WWG = ({WWGData}) => {
 
  
    const [activeProfileID, setActiveProfileID] = useState(WWGData[0].profile_number)
     
    const hourVals = []
    for(let i=0; i< 24; i++){hourVals.push(`${i<10 ? "0"+String(i) : String(i)}:00:00`)}

    return (
        <div style={{flex: 1, display: 'flex', flexDirection: 'row'}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{alignSelf: 'flex-start', display: 'flex', flexDirection: 'row'}}>
                    <select style={{width: 220, height: 50}} value={activeProfileID} onChange={(e)=>(setActiveProfileID(e.target.value))}>
                        {WWGData.map((item, index) => <option key={String(item.profile_number)} value={item.profile_number}>{`${item.profile_number} ${item.profile_name}`}</option>)}      
                    </select>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems:'flex-end'}}>
                        <label style={{width: 80, textAlign:'right' }}>PCC</label>
                        <input style={{width: 60, flex:1, marginLeft: 10}} value={WWGData[activeProfileID-1]["pcc"]} />
                    </div>
                </div>
                <div style={{marginTop: 10}}>
                    <RWTable 
                        columns={["Hours", "Weekday Factor", "Weeked Factor"]}
                        data={createTimeSeriesDataForWWGTable(WWGData[activeProfileID - 1])}
                        dataType={["text", "number", "number"]}
                        updateTable={() => {}}
                        tableDimension={[310, 500]}
                    />
                </div>
            </div>
            <div>
                <SubPlot 
                    xArray={hourVals}
                    yData={WWGData[activeProfileID-1]["weekday_profile"]}
                    label={"WWG-WeekDay Profile"}
                />
                <SubPlot 
                    xArray={hourVals}
                    yData={WWGData[activeProfileID-1]["weekend_profile"]}
                    label={"WWG-WeekEnd Profile"}
                />
            </div>
        </div>
  )
}
