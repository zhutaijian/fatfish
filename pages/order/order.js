// pages/order/order.js
var config = require('../../config/config.js');
var util = require('../../utils/util.js');
var lastIndex =0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    orders:[],
    unPayOrders:[],
    waitFahuoList:[],
    waitShouhuoList:[],
    wellDone:[],
    status: ["orders", "waitPay", "waitDelivery","waitReceive","wellDone"],
    _index:0,
    animationData: {},
    winHeight:0,
    leftValue:0,
    ss: { "waitPay": "待付款", "waitDeli": "待发货", "waitReceive": "待收货", "wellDone": "完成" },
    orderTypes: [{ id: "all", text: "全部" }, { id: "wait-pay", text: "待付款" }, { id: "wait-fahuo", text: "待发货" }, { id: "wait-receive-huo", text: "待收货" }, { id: "success", text: "已完成" }],
    firstLoad:{},
    totalPage:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title:"我的订单"
    });
    this.setData({
      _index: parseInt(options.index) + 1||0,
      defaultType: (parseInt(options.index)+1)*166
    })
    this.getOrders({ pageSize: 4, currentPage: this.data.page, status: parseInt(options.index) + 1||0},this);
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
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (options) {
   
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
  continuePay(event) {
    var that = this;
    var id = event.currentTarget.id;
    var item = util.findProById(id, this.data.waitPay||this.data.orders)[0];
    item.orderId = id;
    wx.navigateTo({
      url: '/pages/orderdetail/orderdetail?order=' + JSON.stringify(item)
    });
  },
  seeOrderInfo(event){
    var id = event.currentTarget.id;
    wx.navigateTo({
      url: '/pages/orderinfo/orderinfo'
    });
  },
  deleteProduct(event){
    debugger;
    var that =this;
    var id = event.currentTarget.id;
    var index = event.currentTarget.index;
    var item = util.findProById(id, this.data.waitPay || this.data.orders)[0];
    wx.request({
      url: config.api.queryOrder + "/" + id,
      method: "delete",
      complete: function (res) {
        //.splice(index, 1);
        if (that.data._index==0){
          that.data.orders.splice(index, 1);
          that.setData({
            orders: that.data.orders
          })
        }else{
          that.data.waitPay.splice(index, 1);
          that.setData({
            waitPay: that.data.waitPay
          })
        }
        
      },
      success: function (res) {
        // if (res.data.code == 0) {
        //   resolve(res)
        // }
      }
    });


  },
  confirmShouhuo(event){
   var that = this;
    var id = event.currentTarget.id;
    var item = util.findProById(id, this.data.waitReceive || this.data.orders)[0];
    item.orderId = id;
    item.status ="wellDone";
   // item.productinfo = JSON.stringify(item.productinfo);
    wx.request({
      url: config.api.queryOrder+"/"+id,
      method: "post",
      data:item,
      complete: function (res) {
        that.data.waitReceive.splice(item.cartIndex, 1);
       that.setData({
         waitReceive: that.data.waitReceive
       })
      },
      success: function (res) {
        if (res.data.code == 0) {
          resolve(res)
        }
      }
    });

  },
  changeOrderTyepe(event){
    var index = event.currentTarget.dataset.index;
    this.animation.translate3d((index)*166+"%",0,0).step({ duration: 500 })
    this.setData({
      _index: index,
      animationData: this.animation.export()
    });
    this.getOrders({ pageSize: 4, currentPage: this.data.page, status: index}, this);
  },
  getOrders: function (obj, that) {
    if (that.data.page - 1 < that.data.totalPage) {
      wx.showLoading({
        title: '加载中',
      })
      that.setData({
        isLoading: true
      })
      var url = config.static.imageDomain + '/api/v2/orders?pageSize=' + obj.pageSize + '&currentPage=' + obj.currentPage + "&openid=" + wx.getStorageSync('openid');
      if (obj.status) {
        url = url + '&status=' + that.data.status[obj.status];
      }
      wx.request({
        url: url,
        method: "get",
        complete: function (res) {
          wx.hideLoading();
          res['data'] = res['data'].map(function(item){
            item.date = new Date(item.date).Format('yyyy-MM-dd  hh:mm:ss');
            //item.productinfo = JSON.parse(item.productinfo);
            item.totalPrice = Number(item.totalPrice).toFixed(2);
            return item;
          });
          var listname = that.data.status[obj.status];
          that.data.firstLoad[listname] = true;
          that.setData({
            firstLoad: that.data.firstLoad,
            [listname]:res.data
          })
        },
        success: function (res) {
          if (res.data.code == 0 || res.statusCode==200) {
          //  resolve(res)
          }
        }
      });
    }
  }
})