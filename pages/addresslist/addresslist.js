// pages/addresslist/addresslist.js
var config = require('../../config/config.js');
var x1 ,y1,x2,y2;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData: {},
    addressList: [],
    firstLoad:false,
     addressList2:[
       {name:"朱太建",telephone:"13773014328",address:"江苏省太仓市南城水岸"}
     ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
   // this.getAddress();
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
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation;
    wx.setNavigationBarTitle({
      title: '我的地址'
    });
    this.getAddress();
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
  addAddress(){
    wx.navigateTo({
      url: '/pages/addressadd/addressadd'
    });
  },
  editAddress(event){
    var id = event.currentTarget.dataset.id;
    var index = event.currentTarget.dataset.index;
    var that = this;
    wx.navigateTo({
      url: '/pages/addressadd/addressadd?type=edit&id=' + id + "&data=" + JSON.stringify(that.data.addressList[index])
    });

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  touchstart(event) {

    x1 = event.changedTouches[0].clientX;
    y1 = event.changedTouches[0].clientY;
    //}= { event.changedTouches[0].clientX, event.changedTouches[0].clientY};
  },
  touchmove(event) {

  },
  getAddress: function () {
    var that = this;
      wx.showLoading({
        title: '加载中',
      })
      that.setData({
        isLoading: true
      })
      var url =config.api.accountAddress;
      url = url + "?openid=" + wx.getStorageSync('openid');
      wx.request({
        url: url,
        method: "get",
        complete: function (res) {
          that.setData({
            firstLoad:true,
            addressList: res.data.accountAddressList
          })
          wx.hideLoading();
         
        },
        success: function (res) {
          if (res.data.code == 0) {
            resolve(res)
          }
        }
      });
  },
  deleteAddress(event) {
    var index = event.currentTarget.dataset.index;
    var id = event.currentTarget.dataset.id;
    var self = this;
    wx.showModal({
      title: '提示',
      content: '你确定要删除该地址吗？',
      success: function (res) {
        if (res.confirm) {
          self.doDeleteAddress(index,id);
        } else if (res.cancel) {
          self.data.addressList[index]['deleteStatus'] = false;
          self.setData({
            addressList: self.data.addressList
          });
        }
      }
    })
  },
  doDeleteAddress(index,id){
    var self = this;
    var url = config.api.accountAddress;
    url = url + "/" +id;
    wx.request({
      url: url,
      method: "delete",
      complete: function (res) {
        self.data.addressList.splice(index, 1);
        self.setData({
          addressList: self.data.addressList
        });

      },
      success: function (res) {
        if (res.data.code == 0) {
          resolve(res)
        }
      }
    });

  },
  touchend(event) {
    var index = event.currentTarget.dataset.index;
    x2 = event.changedTouches[0].clientX;
    y2 = event.changedTouches[0].clientY;
    if (Math.abs(x1 - x2) > Math.abs(y1 - y2)) {
      if (x1 > x2) {
        this.animation.step({ duration: 500 })
        this.data.addressList[index]['deleteStatus'] = true
        this.setData({
          animationData: this.animation.export(),
          addressList: this.data.addressList
        })
      } else {
        this.data.addressList[index]['deleteStatus'] = false;
        this.setData({
          addressList: this.data.addressList
        })
      }
    }

  }
})