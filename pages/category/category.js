// pages/category/category.js
var couponService = require("../minecoupons/minecoupons.service");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [{ text: '新鲜水果', id: "fruit" }, { text:'网红零食',id: "food"}, {text:'精致烘焙',id:"cake"}, {text:'优质牛奶',id:"milk"}]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  receiveCoupon(){
    couponService.receiveCoupon("", "").then((res)=>{


    })


  },
  gotoCategoryProduct(event){
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/categoryproducts/categoryproducts?id=' + id
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
  onShow: function () {
  
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
  
  }
})