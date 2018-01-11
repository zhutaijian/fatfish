// pages/limittimebuy/limittimebuy.js
var config = require('../../config/config.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    isLoaded: false,
    isPaying: false,
    begin: false,
    sellPercent: 0,
    flag:false,
    delayHour:"00",
    delayMin:"00",
    delaySecond:"00",
    activeTab:"",
    sectionParts:[],
    delay: "00:00:00"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var address = wx.getStorageSync('user_address');
    var user_name = wx.getStorageSync('username');
    var telNumber = wx.getStorageSync('telNumber');
    this.setData({
      address: address,
      username: user_name,
      telNumber: telNumber
    });
    this.getAllLimitTime();
  
  },
  getAllLimitTime(){
    var that = this;
    wx.request({
      url: config.api.getLimitTimeBuy ,
      method: "get",
      complete: function (res) {
      
        that.setData({
          activeTab: res.data[0]._id,
          sectionParts: res.data
        });
        that.fetchInfo();
        that.calHeaderTitle();
      },
      success: function (res) {

      }
    });
  },
  checkAllProducts(callback) {
    var _ids = util.collectOneField(this.data.info.products, '_id');
    if (_ids.length == 0) {
      return;
    }
    var url = config.api.getProductsByIds + "?ids=" + _ids + "&openid=" + wx.getStorageSync('openid');
    wx.request({
      url: url,
      method: "get",
      complete: function (res) {
        callback && callback(res);

      },
      success: function (res) {
        if (res.data.code == 0) {
          resolve(res)
        }
      }
    });

  },
  calHeaderTitle(){
    //this.data.sectionParts.
    var that = this;
    this.data.sectionParts.map(function(item){
      item.isbegin = that.calTimeToShow2(item.beginDate, item.endDate);
      return item;
    });
    that.setData({
      sectionParts: that.data.sectionParts
    });
    //that.calTimeToShow();
    setTimeout(that.calHeaderTitle.bind(that),1000)
  },
  calTimeToShow2(beginDate, enDate){
    var that = this;
    beginDate = new Date(beginDate).getTime();
    enDate = new Date(enDate).getTime();
    var interal = 0;
    if (beginDate > new Date().getTime()) {
      return false
      //interal = beginDate - new Date().getTime();
    }
    else if (beginDate < new Date().getTime() && new Date().getTime() < enDate) {
      return true;
     // interal = enDate - new Date().getTime();
    } else {
      return "finish";
    }
  },
  setActiveTab(event){
 
    var _id = event.currentTarget.dataset.id;
    this.setData({
      activeTab: _id
    })
    this.fetchInfo();


  },
  calTimeToShow() {
    var that = this;
    var beginDate = this.data.info.beginDate;
    var enDate = this.data.info.endDate;
    beginDate = new Date(beginDate).getTime();
    enDate = new Date(enDate).getTime();
    var interal = 0;
    if (beginDate > new Date().getTime()) {
      this.setData({
        begin: false
      })
      interal = beginDate - new Date().getTime();
    }
    else if (beginDate < new Date().getTime() && new Date().getTime() < enDate) {
      this.setData({
        begin: true
      });
      interal = enDate - new Date().getTime();
      if (!that.data.flag){
        that.setData({
          flag:true
        })
        that.refreashInfo();
        
      }
    } else {
      this.setData({
        begin: "finish"
      })
    }

    var hourInteral = 3600 * 1000;
    var minInteral = 60 * 1000;
    var secondInteral = 1000;
    var maxHour = Math.floor(interal / hourInteral);
    var maxMin = Math.floor((interal - maxHour * hourInteral) / minInteral);
    var maxSecond = Math.floor((interal - maxHour * hourInteral - maxMin * minInteral) / secondInteral);
    maxHour = (maxHour > 9 ? maxHour : "0" + maxHour) + "";
    maxMin = (maxMin > 9 ? maxMin : "0" + maxMin) + "";
    maxSecond = maxSecond > 9 ? maxSecond : "0" + maxSecond;
    this.setData({
      delayHour: maxHour,
      delayMin: maxMin,
      delaySecond: maxSecond
     
    })
    setTimeout(this.calTimeToShow.bind(this), 1000)
  },
  refreashInfo() {
    var that = this;
    if (this.data.begin && this.data.begin != 'finish') {
      this.checkAllProducts(function (res) {
        var products = that.data.info.products.map(function (item, index) {
          var product = util.findProById(item._id, res.data)[0];
          item.sellCount = product.sellCount || 0;
          item.number = product.number || 0;
          item.sellPercent = that.returnPercent(item.sellCount, item.number);
          return item;
        });
        that.data.info = Object.assign({}, that.data.info, { products: products })
        that.setData({
          info: that.data.info
        });
        setTimeout(function(){
          that.refreashInfo();
        },3000)
      });
    }


  },
  getUserLocation: function () {
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
  pay(event) {

    var that = this;
    var app = getApp();
    if (that.data.isPaying) {
      return;
    }
    that.setData({
      isPaying: true
    });
    var _id = event.target.dataset.id;
    var products = []; this.data.info.products.filter(function (item) {
      if (item._id == _id) {

        products.push({
          count: 1,
          url: item.src,
          price: item.price,
          title: item.title,
          _id: item._id,
          islimitproduct: item.islimitproduct
        });
      }
    })
    var userInfo = app.globalData.userInfo;

    wx.request({
      url: config.api.createOrder,
      method: "post",
      data: {
        islimitbuy: products[0].islimitproduct,
        buyType: "quickbuy",
        deliveryTime: "30",
        desc: "限时抢",
        address:that.data.address,
        deliveryPay: 5,
        mobile: that.data.telNumber,
        totalPrice: 0.01,
        openid: wx.getStorageSync('openid'),
        products: [_id],
        productinfo: products,
        user: JSON.stringify(userInfo)
      },
      fail: function (res) {

      },
      success: function (res) {
        if (res.errMsg == "request:ok") {
          var data = res.data;
          if (data.status == "waring2") {
            wx.showToast({
              title: '亲，您已经购买过该商品了',
              icon: false,
              duration: 2000
            });
            that.setData({
              isPaying: false
            });
            return;
          }
          if (data.status == "waring") {
            wx.showToast({
              title: '亲，该商品已售罄',
              icon: false,
              duration: 2000
            });
           
            return;
          }
          if (!wx.getStorageSync("user_address")){
            wx.showModal({
              title: '提示',
              content: '先填写地址，方便我们联系你',
              cancelText:"放弃抢购",
              confirmText: "继续抢购",
              success: function (res) {
                if (res.confirm) {
                  that.getUserLocation();
                } else if (res.cancel) {
                  
                }
              }
            })
            that.setData({
              isPaying: false

            });
            return;
          }
         
          wx.requestPayment(
            {
              'timeStamp': data.params.timeStamp,
              'nonceStr': data.params.nonceStr,
              'package': data.params.package,
              'signType': 'MD5',
              'paySign': data.paySign,
              'success': function (res2) {
                that.setData({
                  isPaying: false
                });
                wx.navigateTo({
                  url: '/pages/successpay/successpay?prepay_id='
                });
              },
              'fail': function (res) {
                that.setData({
                  isPaying: false
                });
                

              }
            })


        } else {

        }

      }
    });
  },
  fetchInfo(id) {
    var that = this;
    id = id || this.data.activeTab;
    wx.request({
      url: config.api.getLimitTimeBuy + "/" + id,
      method: "get",
      complete: function (res) {
        that.setData({
          isLoaded: true
        })
        res.data.products = res.data.products.map(function (item) {
          item.sellCount = item.sellCount || 0;
          item.sellPercent = that.returnPercent(item.sellCount, item.number);
          item.src = config.static.imageDomain + '/media/' + util.formatDate(item.thumbnail) + '/' + item.thumbnail._id + '/' + item.thumbnail.fileName;
          return item;
        });

        that.setData({
          info: res.data
        });
        setTimeout(that.calTimeToShow.bind(that), 1000)

      },
      success: function (res) {

      }
    });


  },
  returnPercent(sellCount, totalNumber) {

    return Number(sellCount * 100 / (sellCount + totalNumber)).toFixed(2) + "%"



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