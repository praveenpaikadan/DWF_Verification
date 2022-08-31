export const cleanFMData= (rawFSData) => {
    var cleanedTS = []
    var cleanedValues = []
    
    for(let i=1; i<rawFSData.length ;i++){
        cleanedTS.push(rawFSData[i][0])
        cleanedValues.push(Number(rawFSData[i][1]))
    }
    return({ts: cleanedTS, values: cleanedValues})
}

export const extractSubData = (rawSubData) => {
    var fields_to_be_extracted = ["subcatchment_id", "population", "wastewater_profile", "base_flow", "additional_foul_flow", "trade_flow", "trade_profile"] 
    var indices = fields_to_be_extracted.map((item) => rawSubData[0].indexOf(item))
    var returnData = []
    for(var i = 1; i < rawSubData.length-1; i++){
        let obj = {}
        indices.forEach((index, j) => {
            obj[`${fields_to_be_extracted[j]}`] = ( fields_to_be_extracted[j] === "subcatchment_id" ? rawSubData[i][index] : Number(rawSubData[i][index]))
        })
        returnData.push(obj)
    }

    console.log(returnData)
    return returnData
}

export const extractWWGData = (rawWWGData) => {
    var profiles = []
    var activeIndex = -1
    var i = 0;
    var values = [] // temporary variable to  save oordinate data
    while(i < rawWWGData.length){
        if(rawWWGData[i][0] === 'PROFILE_NUMBER'){
            activeIndex = activeIndex + 1
            let new_profile = {
                profile_number: Number(rawWWGData[i+1][0]),
                profile_name: rawWWGData[i+1][1],
                pcc: Number(rawWWGData[i+1][2])
            }
            var done_extraction = false
            while(!done_extraction){
                i = i+1
                if(rawWWGData[i][0] === 'CALIBRATION_WEEKDAY'){   
                    i = i+2                    
                    values = []
                    var end = i + 24
                    while(i < end){
                        values.push(Number(rawWWGData[i][1]))
                        i++
                    }
                    new_profile["weekday_profile"] = values
                }
                    
                if(rawWWGData[i][0] === 'CALIBRATION_WEEKEND'){       
                    i = i+2                    
                    values = []
                    var end = i + 24
                    while(i < end){
                        values.push(Number(rawWWGData[i][1]))
                        i++
                    }
                    new_profile["weekend_profile"] = values
                    done_extraction = true
                }   
                
            }
            profiles.push(new_profile)
        }else{
            i = i + 1;
        }
        
    }
    console.log(profiles)
    return profiles
}

export const extractTFGData = (rawWWGData) => {
    var profiles = []
    var activeIndex = -1
    var i = 0;
    var values = [] // temporary variable to  save oordinate data
    while(i < rawWWGData.length){
        if(rawWWGData[i][0] === 'PROFILE_NUMBER'){
            activeIndex = activeIndex + 1
            let new_profile = {
                profile_number: Number(rawWWGData[i+1][0]),
                profile_name: rawWWGData[i+1][1],
                pcc: Number(rawWWGData[i+1][2])
            }
            var done_extraction = false
            while(!done_extraction){
                i = i+1
                if(rawWWGData[i][0] === 'CALIBRATION_WEEKDAY'){   
                    i = i+2                    
                    values = []
                    var end = i + 24
                    while(i < end){
                        values.push(Number(rawWWGData[i][1]))
                        i++
                    }
                    new_profile["weekday_profile"] = values
                }
                    
                if(rawWWGData[i][0] === 'CALIBRATION_WEEKEND'){       
                    i = i+2                    
                    values = []
                    var end = i + 24
                    while(i < end){
                        values.push(Number(rawWWGData[i][1]))
                        i++
                    }
                    new_profile["weekend_profile"] = values
                    done_extraction = true
                }   
                
            }
            profiles.push(new_profile)
        }else{
            i = i + 1;
        }
        
    }

    console.log(profiles)
    return profiles
}