var config = require('../../config/config.js');
var app = getApp();
var userId = wx.getStorageSync('userId');
module.exports = {
   receiveCoupon(couponId){
     return new Promise((reslove, reject) => {
       wx.request({
         url: config.api.getCoupons,
         method: "post",
         data:{
           user: userId,
           coupon: ["", "5a519421b571d16382139c9d", "5a52d4fa362a2a7974db9d40"][Math.ceil(Math.random(0, 1) * 2)]
         },
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
   },
   getMyCoupons:(params)=>{
      return new Promise((reslove,reject)=>{
        wx.request({
          url: config.api.getCoupons+'?status=normal',
          method: "get",
          data: { ...params, user: userId},
          complete: function (res) {
              
          },
          success: function (res) {
            if (res.errMsg == "request:ok") {
              reslove(res.data)
            }else{
              reject(res);
            }
          }
        });
      })
   }
}