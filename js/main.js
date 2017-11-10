/**
 * @file main.js
 * @description fetches all the necessary data and then display
 * on the chart.
 * @author Eshan Shafeeq
 **/

$(document).ready(function() {

  const METRICS = "metrics"
  const UNITIDS = "unitids"
  const GRAPH = "graph"

  var success_request_vals = 0
  var request_count = 0, data_count=0
  var traces = {}
  var responses = {}
  var downloaded_data = {}

  //generic request function
  function request_data( api_req, done ){
    console.log("requesting data for " + api_req.request_obj.datatype)
    $.ajax(api_req.request_obj).done(function( response ){

      //TODO: if response is successful
      success_request_vals++
      responses[api_req.request_obj.datatype]=response
      api_req.onsuccess()

    })
  }

  //plotly code
  function plot( data ){
    var plotDiv = document.getElementById('plot');
    var t=[]
    var traces = [
    	{x: [1,2,3,4,5,6,7,8,9,10,11,12], y: [2,1,4,5,6,7,8,9,4,2,4,6], fill: 'tozeroy'},
    	{x: [1,2,3,4,5,6,7,8,9,10,11,12], y: [1,1,2,1,2,3,4,5,3,2,1,2], fill: 'tonexty'},
    	{x: [1,2,3,4,5,6,7,8,9,10,11,12], y: [3,0,2,2,1,2,3,4,56,8,9,1], fill: 'tonexty'}
    ];
    for (var key in data) {
      console.log(key)
      for(var k in data[key]){
        var ty=[]
        var tx=[]
        for (var i = 0; i < data[key][k].length; i++) {
          //console.log(data[key][k][i])
          var current_value = data[key][k][i].value
          ty.push(current_value)
          tx.push(new Date(data[key][k][i].time))
        }
        break
      }
      if( ty.length != 0 )
      t.push({x:tx, y:ty, fill:"tonexty"})
    }
    t[0]["fill"]="tozeroy"
    console.log(t)

    function stackedArea(traces) {
    	for(var i=1; i<traces.length; i++) {
    		for(var j=0; j<(Math.min(traces[i]['y'].length, traces[i-1]['y'].length)); j++) {
    			traces[i]['y'][j] += traces[i-1]['y'][j];
    		}
    	}
    	return traces;
    }

    Plotly.newPlot(plotDiv, stackedArea(t), {title: 'stacked and filled line chart'});
  }

  //get_graph_data
  function populate_graph_data( unitid, metric, data_length ){
    data_count++
    $.ajax( new api_request(ROOT_URL+"/"+unitid+metric.id+".json", GRAPH).request_obj )
      .done(function(response){
        if( traces[unitid] == undefined ) traces[unitid]={}
        traces[unitid][metric.name]=response
        request_count++
        if( request_count == data_count ){
          console.log("we have all the data")
          //console.log(traces)
          plot(traces)
        }
      })
  }

  function main(){
    //download the data for all the metrics and units
    function download_all(){
      if ( success_request_vals == 2 ) {
        for( var j=0; j<responses[UNITIDS].data.length; j++ ){
          var unitid = responses[UNITIDS].data[j]
          for( var i=0; i<responses[METRICS].data.length; i++ ){
            var metric = responses[METRICS].data[i]
            //if(j==0 && i==0)
            populate_graph_data( unitid, metric )
          }
        }

      }else{
        console.log("not all data have been downloaded")
      }
    }


    //request for unitids and list of metrics
    var unitids_request = new api_request(UNITIDS_URL, UNITIDS)
    unitids_request.set_onsuccess(download_all)
    request_data( unitids_request )

    var metrics_request = new api_request(METRICS_URL, METRICS)
    metrics_request.set_onsuccess(download_all)
    request_data( metrics_request )
  }

  main()

})
