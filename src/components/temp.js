console.log(`
// Flow Verification Area Estimator Tool - version 1.0
// Author : Praveen Paikadan (praveen.paikadan@atkinsglobal.com, praveenpaikadan@gmail.com, https://github.com/praveenpaikadan)
`)


var r1 = document.getElementById("r1");
var r2 = document.getElementById("r2");
var r3 = document.getElementById("r3");
var dwf = document.getElementById("dwf");
var gip = document.getElementById("gip");
var gia = document.getElementById("gia");
var bf = document.getElementById("bf");

var extracted = undefined

var created_options= false

const input_elements = Array.from(document.getElementsByClassName('inp'));
const perc_elements = Array.from(document.getElementsByClassName('perc'));
const area_elements = Array.from(document.getElementsByClassName('area_hect'));


const arrayMinMax = (arr) =>
      arr.reduce(([min, max], val) => [Math.min(min, val), Math.max(max, val)], [
        Number.POSITIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
      ]);
	  
const calculate_flows = (factors) => {
	R1 = []
	R2 = []
	R3 = []
	DWF = []
	BF = []
	GI = []
	
	bf = Number(factors["BF"])
	GI_profile_index = factors["GIP"]
	GI_profile_name = extracted["GI_profiles"][GI_profile_index]
	GI_unit_flows = extracted['GI'][GI_profile_index] 
	TF = []
	
	for(var i = 0; i< extracted["sim_ts"].length ; i++){
		let r1 =  extracted["R1"][i] * factors["R1"]
		let r2 =  extracted["R2"][i] * factors["R2"]
		let r3 =  extracted["R3"][i] * factors["R3"]
		let dwf = extracted["DWF"][i]
		var gi = GI_unit_flows[i] * factors["GIA"]
		
		R1[i] = r1; 
		R2[i] = r2; 
		R3[i] = r3; 
		GI[i] = gi; 
		BF[i] = bf; 
		TF[i] = r1 + r2 + r3 + gi + dwf + bf
	}	
	
	return ({R1, R2, R3, DWF, BF, GI, TF, GI_profile_name})
}

const download = () => {
	
	data = []
	var recieved_subdata = extracted["sub_data"]
	var recieved_subdata_totals =  extracted["sub_data_totals"]
	var final_values = input_elements.map((item) => Number(item.value))
	var values = final_values
	var fs_ts = extracted["fs_ts"]
	var fs_data_raw = extracted["raw_fs_flow"]
	var results = calculate_flows({"R1": values[0], "R2" : values[1], "R3": values[2], "GIP": values[5], "GIA": values[4], "BF" : values[3]})
	var headers = Object.keys(results)
	
	//console.log(headers)

	
	no_of_sub = recieved_subdata[0].length
	no_of_ts = extracted["sim_ts"].length
	no_of_obs = fs_ts.length
	max_length = arrayMinMax([no_of_sub, no_of_ts, no_of_obs])[1]
	
	//console.log(no_of_sub,no_of_ts, no_of_obs , max_length)
	
	for(var i = data.length + 1; i < max_length; i++){data[i] = {}}
	
	
	for(var i = 0; i < no_of_sub; i++){
		data[i] = {
			"Subcatchment ID": recieved_subdata[0][i], 
			"R1 to Apply": (recieved_subdata[2][i] / recieved_subdata_totals[0] * final_values[0]).toFixed(14) , 
			"R2 to Apply": (recieved_subdata[3][i] / recieved_subdata_totals[1] * final_values[1]).toFixed(14) , 
			"R3 to Apply": (recieved_subdata[4][i] / recieved_subdata_totals[2] * final_values[2]).toFixed(14)  , 
			"Total BF to Apply": (recieved_subdata[1][i] +  (final_values[3] * recieved_subdata[5][i] / recieved_subdata_totals[4])).toFixed(14), 
			}
	}
	data[0]["GIM Profile to be applied"] = extracted["GI_profiles"][final_values[5]]
	data[0]["GIM Area to be applied"] = final_values[4]
	
	
	data[0]["====Break1===="] = "Estimated Flows > "
	for(var i = 0; i < no_of_ts; i++){
		data[i]["SIM_TS"] = extracted["sim_ts"][i]
		data[i]["DWF(cumecs)"] = extracted["DWF"][i]
		for(var j = 0; j < 7; j++){
			if(headers[j] !== "DWF"){ 			
				data[i][headers[j] + "(cumecs)"] = results[headers[j]][i]
			}
		}
	}
	
	//console.log(data)
	
	data[0]["====Break2===="] = "FS flows(cumecs)SIM_TS > "
	for(var i = 0; i < no_of_ts; i++){
		data[i]["Adjstd FS Flows(cumecs)"] = extracted["fs_flow"][i]
	}
	
	data[0]["====Break3===="] = "Raw FS Data > "
	for(var i = 0; i < no_of_obs; i++){
		data[i]["Time"] = fs_ts[i]
		data[i]["Raw FS Flows(cumecs)"] = fs_data_raw[i]
	}
	

    var csv = Papa.unparse(data);
    var csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    var csvURL =  null;
    if (navigator.msSaveBlob)
    {
        csvURL = navigator.msSaveBlob(csvData, 'download.csv');
    }
    else
    {
        csvURL = window.URL.createObjectURL(csvData);
    }
    var tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'results_'+ new Date() + '.csv');
    tempLink.click();
}



const refine_fs_data = (sim_ts, fs_ts, fs_flow) => {
	
	const FS_TIME_STEP_MINS = 2
	const SIM_TIME_STEP_MINS = 5
	
	var firstIndexInFS = undefined
	var firstIndexInSIM = undefined
	
	for(var d = 0; d < sim_ts.length ; d++ ){
		if(fs_ts.indexOf(sim_ts[d]) != 1){
			firstIndexInFS = fs_ts.indexOf(sim_ts[d])
			firstIndexInSIM = d
			break
		}
	}
	
	var new_fs_flow = []
	for(var i = 0; i < sim_ts.length ; i++){
		new_fs_flow[i] = 0
	}
	

	for(var i = firstIndexInSIM; i < sim_ts.length ; i=i+2){
		
		var indexInFS = firstIndexInFS + ((i-firstIndexInSIM) * 2.5 )
		if(indexInFS > fs_flow.length-4){
			break
		}
		
		var point1 = Number(fs_flow[indexInFS])
		var point2_1 = Number(fs_flow[indexInFS + 2] )
		var point2_2 = Number(fs_flow[indexInFS + 3] )
		var point2 = ( point2_1+point2_2 ) / 2
		
		//console.log(indexInFS, indexInFS + 2, indexInFS + 3, '        ', point1, point2_1, point2_2, point2)
		
		new_fs_flow[i] = point1
		new_fs_flow[i+1] = point2
	}
	
	//console.log(new_fs_flow)
	
	return new_fs_flow
}



const inital_plot = () => {
	
	var calculated = calculate_flows({"R1": 1, "R2" : 1, "R3": 1, "GIP": 0, "GIA": 1, "BF" : 0})
	
	//console.log(calculated)
    var xArray = extracted["sim_ts"]

    // Define Data
    var data = [
	{
      x: xArray,
      y: extracted["fs_flow"],
      mode:"lines",
	  name: "Observed",
	  line: {
		color: 'green',
		width: 2
	  }
    },
	{
      x: xArray,
      y: extracted["DWF"],
      mode:"lines",
	  name: "DWF",
	  line: {
		color: 'brown',
		width: 1,
	  },

    }, 
	{
      x: xArray,
      y: calculated["BF"],
      mode:"lines",
	  name: "Additional Baseflows",
	  line: {
		color: 'skyblue',
		width: 1,
	  },

    },
	{
      x: xArray,
      y: calculated["R1"],
      mode:"lines",
	  name: "R1",
	  line: {
		color: 'black',
		width: 1,
	  },

    },
	{
      x: xArray,
      y: calculated["R2"],
      mode:"lines",
	  name: "R2",
	  line: {
		color: 'orange',
		width: 1,
	  },

    },
	{
      x: xArray,
      y: calculated["R3"],
      mode:"lines",
	  name: "R3",
	  line: {
		color: '#33cc33',
		width: 1,
	  },

    },
	{
      x: xArray,
      y: calculated["GI"],
      mode:"lines",
	  name: "GI",
	  line: {
		color: 'purple',
		width: 1,
	  },

    },
	{
      x: xArray,
      y: calculated["TF"],
      mode:"bar",
	  name: "Total Flows",
	  line: {
		color: 'red',
		width: 2,
	  },

    }
	];
	

    // Define Layout
	
    var minMax = arrayMinMax([data["DWF"]])

    var maxY  = minMax[1]
    var minY = Math.min.apply(null, [minMax[0], 0])

    var layout = {
      xaxis: {range: [0, xArray.length], title: "Time"},
      yaxis: {range: [minY, maxY], title: "Flow(m3/s)"},
      title: "Flow Graph",
	  autosize: false,
	  width: screen.width *0.9,
	  height: 700,
	  margin: {
		l: 120,
		r: 10,
		b: 200,
		t: 150,
		pad: 20
	  },
	  paper_bgcolor: 'white',
	  plot_bgcolor: 'white'
    };

    // Display using Plotly
    Plotly.newPlot("myPlot", data, layout);
    //return {corrected: outData, filename: 'tc_' + (edmmode?'edm_':'rain_') + header[1].replace(/'/g, "") + (edmmode?((datatype === '%'?('_sp='+ sp): ('_input_data_in_'+datatype))):''), edmmode, sp, tolerance, datatype, ignoreBelow:  ignoreBelowElem.value, ignoreAbove: ignoreAboveElem.value, header}
}


// ===================



/*
Data Index

Time Step : 0
Individual areas + DWF: 1-3
DWF Only : 4
Total Areas + DWF : 5
GIM: 6- 15

FS Time: 16
FS Data: 17

*/

const update_percentage = (values) => {
	perc_elements.forEach((element, i) => {
		element.value = (values[i]/extracted["sub_data_totals"][i]*100)
	});
}

const update_inputs = (percentages) => {
	console.log("Fired")
	area_elements.forEach((element, i) => {
		element.value = (percentages[i] * extracted["sub_data_totals"][i] / 100)
	});
}


const calculate = (values) => {
	update_percentage(values)
	//console.log(values)
	var calculated = calculate_flows({"R1": values[0], "R2" : values[1], "R3": values[2], "GIP": values[5], "GIA": values[4], "BF" : values[3]})
	data_update = {'y': [ calculated["BF"], calculated["R1"], calculated["R2"], calculated["R3"], calculated["GI"], calculated["TF"]]}
	//console.log(data_update)
	
	Plotly.update("myPlot", data_update, {}, [2,3,4,5,6, 7])
}

const sum = (array) => {
	var sum = 0
	for(var i = 0; i < array.length; i++){
		sum = sum + array[i]
	}
	return sum
}


const extract_to_format = (data) => {
	sim_no = 0  // no used anywhere 
	fs_no = 0   // no used anywhere 
	sub_no = 0  // no used anywhere 
	
	fs_ts = []
	fs_flow = []
	
	sim_ts = [] 
	R1 = []
	R2 = []
	R3 = []
	DWF = []
	GI = [[], [], [], [], [], [], [], [], [], []]
	
	GI_profiles = []
	
	sub_ids = []
	sub_bfs = []
	sub_r1s = []
	sub_r2s = []
	sub_r3s = []
	sub_tas = [] // total areas
		
	for(var i = 2; i < data.length; i++){
		t = i - 2
		sim_ts_i = data[i][0]
		if(sim_ts_i){
			sim_no ++
			sim_ts[t] = sim_ts_i
			DWF_item = Number(data[i][4])
			R1[t] = data[i][1] - DWF_item
			R2[t] = data[i][2] - DWF_item
			R3[t] = data[i][3] - DWF_item
			DWF[t] = DWF_item
			for(var g = 0; g < 10 ; g++){
				GI[g][t] = data[i][6+g]
			}
		}
		
		fs_ts_i = data[i][16]
		if(fs_ts_i){
			fs_no++
			fs_ts[t] = fs_ts_i
			fs_flow[t] = data[i][17]
		}
		
		sub_id = data[i][18]
		if(sub_id){
			sub_no ++
			sub_ids[t] = sub_id
			sub_bfs[t] = Number(data[i][19])
			sub_r1s[t] = Number(data[i][20])
			sub_r2s[t] = Number(data[i][21])
			sub_r3s[t] = Number(data[i][22])
			sub_tas[t] = Number(data[i][23])
		}
		
		sub_data = [sub_ids, sub_bfs, sub_r1s, sub_r2s, sub_r3s, sub_tas]
	}
	
	GI_profiles = data[1].slice(6,16)

	
	adjstd_fs_flow = refine_fs_data(sim_ts, fs_ts, fs_flow)
	
	var sum_of_areas = [2,3,4,1, 5].map(i => sum(sub_data[i]))
	// sum_of_areas = [...sum_of_areas.splice(2,5), sum_of_areas[1]]
	//console.log(sum_of_areas)

	return ({sim_ts : sim_ts, R1: R1, R2 : R2, R3 : R3, DWF : DWF, GI : GI, GI_profiles: GI_profiles, fs_ts : fs_ts, fs_flow: adjstd_fs_flow, raw_fs_flow: fs_flow,sub_data: sub_data, sub_data_totals: sum_of_areas})
	
}



// =========================


const create_options = (GIM_PROFILES) => {
	if(created_options){return}
	for (var i = 0; i < GIM_PROFILES.length; i++){
		var opt = document.createElement('option');
		opt.value = i;
		opt.value == 0 ? opt.selected = true : null
		opt.innerHTML = GIM_PROFILES[i];
		gip.appendChild(opt);
	}
	created_options = true
}

const set_total = (total) => {
	//console.log(total)
	Array.from(document.getElementsByClassName("t")).forEach((item, index) => {
		//console.log(total[index])
		item.innerHTML = total[index].toFixed(14)
	})
}



const handleResult = (result) => {

    if(result.error){
        //console.log(`<b style="color: red;">Error<b/>. Check input file <br/><br/>`+guidenceText)
        //console.log('Error in parsing. Aborted')
        return
    }else{
		
		//console.log(result.data)
		extracted = extract_to_format(result.data)
		create_options(extracted["GI_profiles"])
		set_total(extracted["sub_data_totals"])
		update_percentage([1,1,1])
		inital_plot(extracted)
		
    }
}

const loadData = (event) => {
    const csvFile = document.getElementById("csvFile");
    const input = csvFile.files[0];
    var config =  {
        delimiter: "",	// auto-detect
        newline: "",	// auto-detect
        quoteChar: '"',
        escapeChar: '"',
        header: false,
        transformHeader: undefined,
        dynamicTyping: false,
        preview: 0,
        encoding: "",
        worker: false,
        comments: false,
        complete: (result) => {handleResult(result)},
        error: undefined,
        download: false,
        skipEmptyLines: false,
        delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP]
    }
    try{
        Papa.parse(input, config)
    }catch(error){
        console.log(error)
        console.log('Error')
    }
}


input_elements.forEach(element => {
   element.onchange = (e) =>{
     calculate(input_elements.map((item) => item.value))
   };
});

perc_elements.forEach(element => {
   element.onchange = (e) =>{
     perc_values = perc_elements.map((item) => item.value)
	 update_inputs(perc_values)
	 calculate(input_elements.map((item) => item.value))
   };
});





















import React from 'react'
import Plot from 'react-plotly.js';

export const MainPlot = ({xArray, fsData, yRange}) => {

console.log(xArray)
  return (
    <div>
       <Plot
         // Define Data
    var data = {[
        {
          x: xArray,
          y: fsData,
          mode:"lines",
          name: "Observed",
          line: {
            color: 'green',
            width: 2
          }
        },
        ]}
    
        layout={ {
            xaxis: {range: [0, xArray.length], title: "Time"},
            yaxis: {range: [yRange[0], yRange[1]], title: "Flow(m3/s)"},
            title: "Flow Graph",
            autosize: false,
            width: 720 *0.9,
            height: 700,
            margin: {
              l: 120,
              r: 10,
              b: 200,
              t: 150,
              pad: 20
            },
            paper_bgcolor: 'white',
            plot_bgcolor: 'white'
       }}
      />
    </div>
  )
}


