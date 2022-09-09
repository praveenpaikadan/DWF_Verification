export const getSCValuesAsArrayForTable = (subData) => {
    return subData.map((item) => Object.keys(item).map((key) => item[key]))
}

export const createTimeSeriesDataForWWGTable = (profile) => {
    var returnVal = []
    for(let i =0; i<24; i++){
        returnVal.push({
            hour: `${i<10 ? "0"+String(i) : String(i)}:00:00`, 
            weekday_factor: profile.weekday_profile[i],  
            weekend_factor: profile.weekend_profile[i], 
        })
    }
    return returnVal
}

export const arrayMinMax = (arr) =>
        arr.reduce(([min, max], val) => [Math.min(min, val), Math.max(max, val)], [
        Number.POSITIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
    ]);

export const sortArrayBasedOnString = (array, key) => { 
    array.sort((a, b) => {
        let fa = a[key].toLowerCase(),
            fb = b[key].toLowerCase();
    
        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    });
    return array
}