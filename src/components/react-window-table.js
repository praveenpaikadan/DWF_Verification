import { useEffect, useState } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
 
const CELL_WIDTH = 100
const CELL_HEIGHT = 30
const COLUMN_HEADER_HEIGHT = 20
const ROW_HEADER_WIDTH = 100
 
export const RWTable = ({columns, data, dataType, updateTable, tableDimension}) => {

    const [focused, setFocused] = useState(false)
    useEffect(() => {
        focused && document.getElementById(focused).focus()
    })

    return(
    <div>
        {/* column header */}
        <div style={{display: 'flex', top: 0, position:'sticky', flexDirection: 'row', width: CELL_WIDTH * columns.length, backgroundColor: 'rgba(0,0,0,0.2)'}}>
                {columns.map((item, index) => 
                    <div style={{boxSizing: 'border-box', width: CELL_WIDTH, padding: 4, textAlign: 'left', border: '1px rgba(0,0,0,0.2) solid'}} key={String(index)}>
                        <label style={{wordWrap: 'break-word', textAlign:'center' ,width: CELL_WIDTH, fontSize: '14px'}} >{item}</label>
                    </div>
                )}
            </div>
        <Grid
            columnCount={columns.length}
            columnWidth={CELL_WIDTH}
            height={tableDimension? tableDimension[1]: 400}
            rowCount={data.length}
            rowHeight={CELL_HEIGHT}
            width={tableDimension? tableDimension[0]: 800}
        >
            {({ columnIndex, rowIndex, style }) => {
                let rowData = data[rowIndex] 
                let sub_id = rowData["subcatchment_id"]
                let field = Object.keys(rowData)[columnIndex]
                let id = `${rowIndex}_${columnIndex}_input_id`

                return(
                <div style={style}>
                    <input id = {id} type={dataType[columnIndex]} value={rowData[field]} style={{boxSizing: 'border-box', width: CELL_WIDTH, height: 30}} onChange={(e) => {e.preventDefault(); setFocused(id); updateTable(sub_id, field, e.target.value); }} />
                </div>
            )}}
        </Grid>
        </div>
)};