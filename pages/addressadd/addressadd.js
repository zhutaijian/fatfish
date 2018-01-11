// pages/addressadd/addressadd.js
var config = require('../../config/config.js');
Page({
  data: {
    formInfo:{
     gender:0
    },
    tags:["家","公司",'学校','其他']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type || 'add';
    wx.setNavigationBarTitle({
      title: type == 'add' ? '新增地址' : "修改地址"
    })
    if (options.type=='edit'){
       this.setData({
         formInfo:JSON.parse(options.data)
       })
    }
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
  checkItem(event){
    var that = this;
    var index = event.currentTarget.dataset.index;
    that.data.formInfo.gender = index;
    that.setData({
      formInfo: that.data.formInfo
    }) 
  },
  bindinput(event){
    var that = this;
    var name = event.currentTarget.dataset.name;
    that.data.formInfo[name] = event.detail.value;
    that.setData({
      formInfo: that.data.formInfo
    }) 
  },
  addMapAddress(){
    var that = this;
    wx.chooseLocation({
      success: function (res) {
      that.data.formInfo.address = res.address;
        that.data.formInfo.locationInfo = res;
       that.setData({
         formInfo: that.data.formInfo
       }) 
      }
    })
  },
  selectTag(event){
    var that = this;
    var name = event.currentTarget.dataset.name;
    that.data.formInfo.tag = name;
    that.setData({
      formInfo: that.data.formInfo
    }) 
  },
  submitAddress(){
    var that = this;
    if (!that.data.formInfo.username){
      wx.showModal({
        title: '提示',
        content: '请先填写姓名',
        showCancel: false,
        success: function (res) {
         
        }
      })
      return ;
    }
    if (!that.data.formInfo.telephone){
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel:false,
        success: function (res) {

        }
      })
      return
    }
    if (!that.data.formInfo.address){
      wx.showModal({
        title: '提示',
        content: '请填写地址',
        showCancel: false,
        success: function (res) {

        }
      })
      return
    }
    that.data.formInfo.openid = wx.getStorageSync('openid');
    var url = config.api.accountAddress;
    wx.request({
      url: url,
      method: "post",
      data: { data: that.data.formInfo} ,
      complete: function (res) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1500
        });
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/addresslist/addresslist'
          });
        }, 1500)
        
      },
      success: function (res) {
        if (res.data.code == 0) {
          resolve(res)
        }
      }
    });
  }
})