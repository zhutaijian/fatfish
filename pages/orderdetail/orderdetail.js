// pages/confirmorder/confirmorder.js
var config = require('../../config/config.js');
var utils = require('../../utils/util.js');
var selectProducts = [];
var desc;
var time
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productIds: [],
    deliveryPay: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options.order);
    var info = JSON.parse(options.order);
 
    
    this.setData({
      info: info
    });
    this.calProductPrice();
   // this.calDelivery();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // calDelivery() {
  //   if (this.data.productIds.length < 3 || this.data.totalPrice < 68) {
  //     //this.data.info.totalPrice = this.data.info.totalPrice-5;
  //     this.setData({
  //       totalPrice: this.data.info.totalPrice,
  //       deliveryPay: 5
  //     })
  //   } else {
  //     this.setData({
  //       deliveryPay: 0
  //     })
  //   }


  // },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '重新结算'
    });

  },
  calProductPrice(totalpay,deliverypay){
   this.setData({
     productPrice:utils.accSub(this.data.info.totalPrice, this.data.info.deliveryPay)
   })
   
  },
  openDesc() {
    wx.showModal({
      title: '友情提示',
      showCancel: false,
      content: '太仓市区购买三件商品且总额满68即可免费送货。其余，统一收配送费5元',
      success: function (res) {

      }
    })

  },
  continuePay(event){
    var that = this;
    var id = this.data.info._id;
    wx.request({
      url: config.api.queryOrder + "/" + id + "/contiue-pay",
      method: "put",
      complete: function (res) {
        if (res.errMsg == "request:ok") {
          var data = res.data;
          wx.requestPayment(
            {
              'timeStamp': data.params.timeStamp,
              'nonceStr': data.params.nonceStr,
              'package': data.params.package,
              'signType': 'MD5',
              'paySign': res.data.paySign,
              'success': function (res) {
                that.setData({
                  carts: []
                });
                wx.setStorageSync('carts', "[]");
                wx.navigateTo({
                  url: '/pages/successpay/successpay'
                });
              },
              'fail': function (res) {

              }
            })


        }
      },
      success: function (res) {
        if (res.data.code == 0) {
          resolve(res)
        }
      }
    });

  }
})