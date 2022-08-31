import React, { useState } from 'react';
import { MainPlot } from '../components/main-plot';

function FM({xArray, fsData}) {
    const arrayMinMax = (arr) =>
        arr.reduce(([min, max], val) => [Math.min(min, val), Math.max(max, val)], [
        Number.POSITIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
    ]);
return (
    <div>
        <MainPlot xArray={xArray} fsData={fsData} yRange={arrayMinMax(fsData)}/> 
    </div>
);
}

export default FM;
