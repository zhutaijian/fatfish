var config = require("../config/config.js");
var resData = {};
var openid;
var login = {
  loginResponders: [],
  login: function (app) {
    var jsCodeDone;
    var self = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: config.api.weAppLogin,
            data: {
              code: res.code
            },
            success: function (res) {
              openid = res.data.openid;
              wx.setStorageSync('openid', res.data.openid);
              wx.setStorageSync('sessionKey', res.data.session_key);
              self.isGetUserInfo(app);
            }
          });
        } else {
         
        }
      }
    });
  },

  logout: function () {

  },
  isGetUserInfo(app) {
    var self = this;
    app.globalData = {};
    wx.request({
      url: config.api.isSetUser,
      data: {
        userInfo: resData.userInfo,
        openid: openid
      },
      header: {
        'content-type': 'application/json'
      },
      method: "POST",
      success: function (res) {
        if (res.data.code) {
          res.data.userinfo.openid = openid;
          app.globalData.userInfo = {
            avatarUrl: res.data.userinfo.thumbnail,
            nickName: res.data.userinfo.nickname,
            gender: res.data.userinfo.sex
          };
          wx.setStorageSync('userId', res.data.userinfo._id);
        } else {
          self.getUserInfo(app);
        }

      }
    });
  },
  setUserInfo(app) {
    var self = this;
    app.globalData = {};
    console.log(openid);
    wx.request({
      url: config.api.setWeAppUser,
      data: {
        userInfo: resData.userInfo,
        openid: openid
      },
      header: {
        'content-type': 'application/json'
      },
      method: "POST",
      success: function (res) {
        app.globalData.userInfo = {
          avatarUrl: res.data.thumbnail,
          nickName: res.data.nickname,
          gender: res.data.sex
        };
        

      }
    });

  },
  getUserInfo(app) {
    var self = this;
    if (app.globalData.userInfo){

     }else{

     }
    wx.getUserInfo({
      success: function (res) {
         resData = res;
        app.globalData = resData;
        console.log(resData);
        self.setUserInfo(app);
      },
      fail: function (data) {
        wx.showModal({
          title: '提醒',
          content: '取消授权，会影响您的付款，请你到小程序设置中修改授权信息',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    });
  }
}

module.exports = login;