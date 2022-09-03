import React from 'react'

const CELL_WIDTH = 90
const CELL_HEIGHT = 20
const COLUMN_HEADER_HEIGHT = 20
const ROW_HEADER_WIDTH = 100

const Cell = ({type, value, onChange, rowIndex, columnIndex}) => {
    return(
    <div style={{width: CELL_WIDTH }}>
        <input style={{width: CELL_WIDTH-8, height: CELL_HEIGHT}} type={type} value={value} onChange={(e) => {onChange(e.target.value, rowIndex, columnIndex)}}></input>
    </div>
    )
}

const Row = ({row_header, valueTypeByRow, valueTypeByColumn, values, rowIndex, onChange}) => {

    
    return(
        <div style={{display: 'flex', flexDirection: 'row'}}>
            {values.map((item, index) => {
            var valueType = valueTypeByRow ? valueTypeByRow : (valueTypeByColumn ? valueTypeByColumn[index] : "text")
            return (<Cell 
                type={valueType} 
                value={item} 
                key={String(index)} 
                rowIndex={rowIndex} 
                columnIndex={index} 
                onChange={onChange}
            />)})}
        </div>
    )
}

export const Table = ({heading, column_headers, row_headers, dataObjectArray, valueTypeByRow, valueTypeByColumn, updateTable, tableDimension}) => {
  
    console.log("....", dataObjectArray )
  // setValues is a setState function passed from the parrent component 

  const make2DArrayAndKeyIndex = (data) => {
    var values = []
    console.log(data[0])
    var rowKeyArray = []  //row key array will contain the values in first coluumn in order. 
    data.forEach((item) => { 
        var entry = Object.keys(item).map((key) => item[key])
        values.push(entry)
        rowKeyArray.push(entry[0])
    })

    
    var columnKeyArray = Object.keys(data[0])
    return ({values, columnKeyArray, rowKeyArray})
  }

  var {values, columnKeyArray, rowKeyArray} = make2DArrayAndKeyIndex(dataObjectArray) 

//   console.log("...........1", values, "........2", columnKeyArray, "........3", rowKeyArray)

  const onChange =(value, rowIndex, columnIndex) => {
    updateTable(rowKeyArray[rowIndex], columnKeyArray[columnIndex], value)
    console.log(rowKeyArray[rowIndex], columnKeyArray[columnIndex], value)
  }

  return (
    <div style={{}}>
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <label style={{}}>{heading}</label>
        </div>

        <div style={{display: 'flex', flexDirection: 'row', width: tableDimension[0], height: tableDimension[1]}}>

            <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{height: COLUMN_HEADER_HEIGHT}}>
                    
                </div>
                <div style={{display: 'flex', flexDirection: 'column', width: ROW_HEADER_WIDTH}}>
                    {row_headers.map((item, index ) => <label style={{height: CELL_HEIGHT + 6}} key={String(index)}>{item}</label>)}
                </div>
                
            </div>

            <div style={{display:'flex', flexDirection: 'column', overflowX: 'scroll'}}>
                <div style={{display: 'flex', top: 0, position:'sticky', flexDirection: 'row', width: CELL_WIDTH * column_headers.length, backgroundColor: 'grey'}}>
                    {column_headers.map((item, index) => 
                        <div style={{boxSizing: 'border-box', width: CELL_WIDTH, textAlign: 'left', border: '1px black grey'}} key={String(index)}>
                            <label style={{wordWrap: 'break-word', textAlign: 'left', width: CELL_WIDTH}} >{item}</label>
                        </div>
                    )}
                </div>
                <div style={{dislay: 'flex', flexDirection: 'column'}}>
                    {values.map((item, index) => 
                    <Row 
                        row_header={row_headers[index]} 
                        valueTypeByRow={valueTypeByRow ? valueTypeByRow[index]: undefined} 
                        valueTypeByColumn={valueTypeByColumn}
                        values={item} 
                        rowIndex={index} 
                        key={String(index)} 
                        onChange={onChange}
                    />)}
                </div>
            </div>
        </div>
    </div>
  )
}

