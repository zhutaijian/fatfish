// pages/confirmorder/confirmorder.js
var config = require('../../config/config.js');
var utils = require('../../utils/util.js');
var couponService = require("../minecoupons/minecoupons.service");
var selectProducts = [];
var desc;
var app = getApp();
var time
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPaying: false,
    productIds: [],
    couponAmount:0,
    type: "delivery",
    selectedDate: "30分钟可送达",
    deliveryPay: 0,
    array: utils.generateTimeList()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  bindchange(event) {
    this.setData({
      selectedDate: this.data.array[event.detail.value]
    })
  },
  bindinput(event) {
    this.setData({
      desc: event.detail.value
    })
  },
  onLoad: function (options) {
    var address = wx.getStorageSync('user_address');
    var user_name = wx.getStorageSync('username');
    var telNumber = wx.getStorageSync('telNumber');
    this.setData({
      couponAmount: options.amount,
      address: address,
      username: user_name,
      telNumber: telNumber
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
 
  openCoupon() {
   wx.redirectTo({
      url: '/pages/minecoupons/minecoupons?source=confirmorder&totalPrice=' + this.data.totalPrice
    });
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
  selectItem(event) {
    var type = event.currentTarget.dataset.type;
    this.setData({
      deliveryPay: type == 'delivery' ? 5 : 0,
      type
    })


  },
  getUserLocation: function () {
    if (this.data.type != 'delivery') {
      return;
    }
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        that.setData({
          address: res.provinceName + res.cityName + res.countyName + res.detailInfo,
          username: res.userName,
          telNumber: res.telNumber,
        })
        wx.setStorageSync(
          'user_address',
          that.data.address
        )
        wx.setStorageSync(
          'username',
          res.userName
        )
        wx.setStorageSync(
          'telNumber',
          that.data.telNumber
        )

      }
    })
  },
  calDelivery() {
    if (this.data.productIds.length < 3 || this.data.totalPrice < 68) {
      this.setData({
        deliveryPay: 5
      })
    } else {
      this.setData({
        deliveryPay: 0
      })
    }
  },
  onShow: function (options) {
    wx.setNavigationBarTitle({
      title: '结算付款'
    });
    var carts = wx.getStorageSync('carts') != '' ? JSON.parse(wx.getStorageSync('carts')) : [];
    var totalPrice = 0;
    var that = this;
    carts = carts.map(function (item, i) {
      if (item.checked && item.count > 0) {
        totalPrice = Number(totalPrice).add(item.count * Math.round(item.price * 100) / 100);
        that.data.productIds.push(item._id);
        return item;
      }
    });
    this.setData({
      carts,
      productIds: that.data.productIds,
      totalPrice
    });
    this.calDelivery();
    couponService.getMyCoupons().then((res) => {
      let count =0;
     res.coupons.filter(($item)=>{
      if(utils.checkCouponValid($item, totalPrice)){
        count++;
      }
     })
     this.setData({
       validCouponCount:count
     })
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
  pay() {
    var that = this;
    if (that.data.address == ''&&this.data.type == 'delivery') {
      wx.showModal({
        title: '提示',
        content: '请先填写地址',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {

          } 
        }
      })
      return;
    }
    if (that.data.isPaying) {
      return;
    }
    that.setData({
      isPaying: true
    });
    var userInfo = app.globalData.userInfo;
    let totalPrice = that.data.deliveryPay + that.data.totalPrice;
    let deliveryTime = that.data.selectedDate;
    let { desc, deliveryPay, address } = that.data;
    wx.request({
      url: config.api.createOrder,
      method: "post",
      data: {
        deliveryTime,
        desc,
        accountCouponId: app.selectedCouponId,
        address,
        deliveryPay,
        totalPrice,
        mobile:"13773014328",
        openid: wx.getStorageSync('openid'),
        products: that.data.productIds,
        productinfo: that.data.carts,
        user: JSON.stringify(userInfo)
      },
      success: function (res) {
        if (res.errMsg == "request:ok") {
          var data = res.data;
          var { params } = data;
          wx.requestPayment(
            {
              ...params,
              'signType': 'MD5',
              'paySign': data.paySign,
              'success': function (res2) {
                that.setData({
                  isPaying: false,
                  carts: []
                });
                wx.setStorageSync('carts', "[]");
                app.selectedCouponId =undefined;
                wx.navigateTo({
                  url: '/pages/successpay/successpay?prepay_id=' + data.prepay_id + '&totalPrice=' + totalPrice + "&amount=" + that.data.couponAmount
                });
              },
              'fail': function (res) {
                that.setData({
                  carts: [],
                  isPaying: false
                });
                wx.setStorageSync('carts', "[]");
                wx.navigateTo({
                  url: '/pages/order/order'
                });
              }
            })
        } else {
          that.setData({
            isPaying: false
          });
        }

      }
    });
  }
})