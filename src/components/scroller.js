import React, { useState } from 'react'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

export const Scroller = ({values, setValue, value, label, selectStyle}) => {

    const handleClick =(dir) => {
        let currIndex = values.indexOf(value)
        console.log(currIndex)
        if(dir === 1 && currIndex !== values.length - 1){
            setValue(values[currIndex + 1])
        }else if(dir === -1 && currIndex != 0){
            setValue(values[currIndex - 1])
        }
    }

    return (
    <div>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 3}}>
            <div style={{display: 'flex', alignItems: 'center', marginLeft: 30}}>
                <FaAngleLeft color={values.indexOf(value) === 0?`rgba(0,0,0,0.4)`:`rgba(0,0,0,0.8)`} size={30} onClick={() => {handleClick(-1)}}/>
                <select style={{width: 100, height: 30, borderRadius: 6,  ...selectStyle}} onChange={(e)=> setValue(e.target.value)} value={value}>
                    {values.map((item, index) => <option key={String(item)} value={item}>{item}</option>)}
                </select>
                <FaAngleRight color={values.indexOf(value) === values.length - 1?`rgba(0,0,0,0.4)`:`rgba(0,0,0,0.8)`} size={30} onClick={() => {handleClick(1)}}/>
            </div>
        </div>
    </div>
  )
}
