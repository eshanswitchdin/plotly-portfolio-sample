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

  //get_graph_data
  function populate_graph_data( unitid, metric ){
    $.ajax( new api_request(ROOT_URL+"/"+unitid+metric+".json", GRAPH).request_obj )
      .done(function(response){
        
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
            populate_graph_data( unitid, metric.id )
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
