var config = require('./config/config.js');
var NumberExtend = require('./config/NumberExtend.js');
var login  = require('./common/login.js');
var utils = require('./utils/util.js');
 let configService =  require('./service/config.service.js');
Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份   
    "d+": this.getDate(), //日   
    "h+": this.getHours(), //小时   
    "m+": this.getMinutes(), //分   
    "s+": this.getSeconds(), //秒   
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
    "S": this.getMilliseconds() //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
App({
  deviceInfo:{},
  globalData: {
    deviceInfo: {},
    configInfo:{},
    userInfo: null,
    encryptedData: "",
    iv: "",
    sid: ""
  },
    onLaunch: function() {
       var that = this;
        utils.getDeviceInfo((res)=>{
           that.deviceInfo  = res;
        })
        configService.getConfig().then((res)=>{
          this.configInfo = res;
        });
        login.login(this);
        
    }
   
})