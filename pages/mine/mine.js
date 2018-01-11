var login = require('../../common/login.js');
var couponService = require("../minecoupons/minecoupons.service");
var config = require('../../config/config.js');
var app = getApp();
Page({
  data: {
    userInfo: null,
    orderTypes: [{ id: "wait-pay", text: "待付款" }, { id: "wait-fahuo", text: "待发货" }, { id: "wait-receive-huo", text: "待收货" }, { id: "success", text: "已完成" }]
  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData);
    var url = config.api.weUserInfoBind;
    wx.request({
      url: url,
      method: "post",
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionKey: wx.getStorageSync("sessionKey"),
        openid: wx.getStorageSync("openid")
      },
      complete: function (res) {

      },
      success: function (res) {
        if (res.data.code == 0) {
            resolve(res)
        }
      }
    });
  },
  onShow() {
    wx.setNavigationBarTitle({
      title: "我的"
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffd600',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })

  },
  onReady(){
    console.log(app.globalData.userInfo);
    console.log(222);


  },
  onLoad: function () {
    var getAppInt;
    var userInfo = app.globalData.userInfo;
    this.setData({
      userInfo
    })
    couponService.getMyCoupons().then((res) => {
      this.setData({
        validCouponCount: res.coupons.length
      })
    })

  },
  scanFun(){
    wx.scanCode({
      scanType: ['qrCode'],
      success:function(text){
        var thisCode = text.result;
        wx.navigateTo({
          url: '/pages/product/product?scancode=' + thisCode,
        })
      },
      fail:function(){
      }
    })
  },
  minecoupons() {

    wx.navigateTo({
      url: '/pages/minecoupons/minecoupons'
    });
  },
  gotoOrder(event) {
    var index = event.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/order/order?index=' + index
    });
  },
  gotoAddress() {
    wx.navigateTo({
      url: '/pages/addresslist/addresslist'
    });
  },
  contract: function () {
    wx.makePhoneCall({
      phoneNumber: '13776293129'
    })
  },
  viewAllOrder() {
    wx.navigateTo({
      url: '/pages/order/order?id='
    });
  }
})