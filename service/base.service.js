const url = 'https://www.woaifruit.com';
const apiPrefix = url + '/api/v2';
function qrstring(url,params){
  let keys = Object.keys(params);
  let str ='';
  if (url.indexOf("?") == -1 && keys.length>0){
     str = '?';
      keys.map((item)=>{
       str = str +"&"+item+"="+params[item]
    })
  }
  return str;

}
function service({ url, method='get', params={},data={}}) {
  return new Promise((reslove, reject) => {
    wx.request({
      url: apiPrefix + url  + qrstring(url,params),
      method,
      data,
      complete: function (res) {
       
      },
      success: function (res) {
        if (res.errMsg == "request:ok") {
          reslove(res.data)
        } else {
          reject(res);
        }
      }

    });
  })

}
module.exports  = {
  service
}