// pages/successpay/successpay.js
var utils = require('../../utils/util.js');
var loader = require('../../components/loader.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPrice:"0.0"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    loader.show(this);
    that.setData(options)
    utils.getOneCategoryById(that).then(() => loader.hide(that, 1));
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#333333',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
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
  goToOrder(){
    var index = 1;
    wx.navigateTo({
      url: '/pages/order/order?index=' + index
    });
  },
  goToBuy(){
    wx.switchTab({
      url: '/pages/index/index'
    });
  },
  onProductTap: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/product/product?id=' + id
    });
  }
})