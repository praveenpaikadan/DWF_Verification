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
    var fields_to_be_extracted = ["subcatchment_id", "population", "wastewater_profile", "base_flow", "additional_foul_flow", "trade_flow", "trade_profile", "user_text_10"] 
    var indices = fields_to_be_extracted.map((item) => rawSubData[0].indexOf(item))
    var returnData = []
    for(var i = 1; i < rawSubData.length-1; i++){
        let obj = {}
        indices.forEach((index, j) => {
            var field = fields_to_be_extracted[j]
            var key = field === "user_text_10" ? "FM" : field 
            obj[`${key}`] = ( ["subcatchment_id", "user_text_10"].includes(field) ? rawSubData[i][index] : Number(rawSubData[i][index]))
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

export const extractFDVData = (dataArray) => {
    
    const convertDataStringToArray = (string) => {
        return string.split(' ').filter(item => item !== "")
    }

    const generateTimeSeriesData = (startString, endString, intervel) => {
        
        const getTimeInFormat = (date) => {

            function pad2(n) {
                return (n < 10 ? '0' : '') + n;
            }
            
            var month = pad2(date.getMonth()+1);//months (0-11)
            var day = pad2(date.getDate());//day (1-31)
            var year= date.getFullYear();
            var hour= pad2(date.getHours());
            var mins = pad2(date.getMinutes());
            
            var formattedDate =  day+"/"+month+"/"+year+" "+hour+":"+mins;
            return(formattedDate); //28-02-2021
        }

        const parseInputTimeString = (timeString) => {
            var dateArray = []
            for(var i = 0; i<5; i++){
                dateArray.push(timeString.substring(i*2, (i*2)+2))
            }
            dateArray[0] = "20" + dateArray[0]
            dateArray = dateArray.map(item => Number(item))
            dateArray[1] = dateArray[1] - 1
            return dateArray
        }

        var startTimestamp = new Date(...parseInputTimeString(startString)).getTime()
        var endTimeStamp = new Date(...parseInputTimeString(endString)).getTime()
        var intervelInMs = Number(intervel)*60*1000

        var timeSeries = []
        for(let i = startTimestamp; i <= endTimeStamp; i = i + intervelInMs ){
            timeSeries.push(getTimeInFormat(new Date(i)))    
        }

        return ({startTimestamp, endTimeStamp, timeSeries})
    }

    // getting pipe dia and MH id
    var indexOfMetaData = dataArray.findIndex((item) => item[0] === '*CSTART') + 1
    var metaDataStringArray = convertDataStringToArray(dataArray[indexOfMetaData][0])
    var pipeDia = Number(metaDataStringArray[0])
    var mhId = metaDataStringArray[2]

    // getting starting, ending time and intervel
    var indexOfTimeData = indexOfMetaData + 1
    var timeDataStringArray = convertDataStringToArray(dataArray[indexOfTimeData][0])
    var startDate = timeDataStringArray[0]
    var endData = timeDataStringArray[1]
    var intervel = timeDataStringArray[2]
    var {startTimestamp, endTimeStamp, timeSeries} = generateTimeSeriesData(startDate, endData, intervel)


    // getting FDV data
    var startIndexOfFDVData = dataArray.findIndex((item) => item[0] === '*CEND') + 1
    var endIndexOfFDVData = dataArray.findIndex((item) => item[0] === '*END') - 1

    var flow = []
    var depth = []
    var velocity = []

    var temp = []

    for(let i = startIndexOfFDVData; i <= endIndexOfFDVData; i++){
        var row = convertDataStringToArray(dataArray[i][0])
        temp.push(row)
        for(let j=0; j<4; j=j+1){
            if(row[j]===undefined){break}
            flow.push(Number(row[0+(j*3)]))
            depth.push(Number(row[1+(3*j)]/1000))
            velocity.push(Number(row[2+(3*j)]))
        }
    }

    console.log(temp)
    console.log(flow)
    console.log(depth)
    console.log(velocity)

    return 
}