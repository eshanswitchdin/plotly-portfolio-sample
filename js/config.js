const access_token = "Token 759665e20786ffba736b91d96b33d110b99b04d5"
//var sample_url_pv = "https://switchd.in/api/v1/chartdata/ffffffff-ffff-ffff-ffff-aadad372/SWDINPV.MMXN1.TotW.instMag[MX]/hour/1509660000000/1510264800000/"
const sample_url_pv = "/cached-responses/pv.json"

const ROOT_URL = "/cached-responses"
const METRICS_URL = ROOT_URL + "/metrics.json"
const UNITIDS_URL = ROOT_URL + "/unitids.json"

var api_request=function(url, datatype){
  var self=this
  this["set_onsuccess"]=function(func){
    self.onsuccess=func
  }
  this["request_obj"]={
    "async": true,
    "crossDomain": true,
    "url": url,
    "onsuccess":null,
    "datatype" : datatype,
    "method": "GET",
    "headers": {
      //"authorization": access_token
    }
  }
}
