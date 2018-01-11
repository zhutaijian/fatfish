var config = require('../../config/config.js');
var utils = require('../../utils/util.js');
var inputNumber = require('../../components/inputnumber.js');
var WxParse = require('../../wxParse/wxParse.js');
var tips = require('../../components/tips.js');
var carts = wx.getStorageSync('carts') != '' ? JSON.parse(wx.getStorageSync('carts')) : [];
var obj;
var deviceInfo = {};

Page({
  data: {
    id: '',
    product: null,
    value: 1,
    swiperHeight: '',
    cartsSize: 0,
    totalPrice: 0,
    buyAnimationData: {},
    buyPopupVisible: false,
    //小程序不能获取组件的高度，暂时写个相对较大的固定值
    buyPopupBottom: '-1000rpx',
    propertyNames: ''
  },
  onPriceTap() {

  },
  onHomeTap() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },
  onCartTap() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },
  onShareAppMessage: function () {

  },
  onAddToCartTap() {
    // utils.onAddToCartTap(this.data.product._id,this.data.product);
  },
  calTotal() {
    var product = this.data.product;
    let obj = utils.calTotalCountAndPrice();
    this.setData(obj);
  },
  getLimitProducCountById(productId) {
    var that = this;
    wx.request({
      url: config.api.getLimitProductCount + "?openid=" + wx.getStorageSync('openid') + "&product=" + productId,
      success: function (res) {
        if (res.data.length > 0) {
          that.setData({
            buyed: res.data[0].total || 0
          })
        } else {
          that.setData({
            buyed: 0
          })
        }

      }
    });



  },
  onLoad(options) {
    var self = this;
    utils.getDeviceInfo().then((res) => {
      deviceInfo = res;
      var that = this;
      this.setData({
        swiperHeight: (deviceInfo.screenWidth) + 'px',
        id: options.id
      });
      wx.showNavigationBarLoading()
      wx.showLoading({
        title: '加载中',
      })
      obj = utils.getProductById(options.id)[0];
      wx.request({
        url: config.api.reqProductDetail.replace(':id', options.id),
        success: function (res) {
          wx.hideLoading();
          wx.hideNavigationBarLoading();
          var product = res.data || null;
          wx.setNavigationBarTitle({
            title: product.title
          });
          product.count = obj ? obj.count : 0;
          product.thumbnail = utils.getRealImage(product);
          product.price = product.price.toFixed(2);
          product.media = product.media || [];
          product["media"] = product.media.map(function (item) {
            item.thumbnail = utils.getRealImage({ thumbnail: item });
            return item.thumbnail;
          });
          product.media = product.media.length == 0 ? [product.thumbnail] : product.media;
          self.setData({
            product: product
          });
          if (product.islimitproduct) {
            self.getLimitProducCountById(product._id);
          }
          self.calTotal();
        }
      });
    });
  },
  confirmOrder(options) {
    this.setData({
      buyPopupVisible: false
    });
    wx.navigateTo({
      url: '/pages/confirmorder/confirmorder?id='
    });


  },

  add(event) {
    if (this.data.product.count >= (this.data.product.limit - this.data.buyed)) {
      tips.show(this, '你已经购买很多啦', 1000);
      return;
    }
    var outNumber = inputNumber.add(this, this.data.product.count, 'product').outNumber;
    if (!outNumber) {
      utils.onAddToCartTap(this.data.product._id, this.data.product);
      this.calTotal();
    }

  },
  sub() {
    inputNumber.sub(this, this.data.product.count, 'product');
    var obj = utils.getProductById(this.data.product._id)[0];
    carts[obj.index] = Object.assign({}, obj, { count: this.data.product.count });
    if (this.data.product.count==0){
      carts.splice(obj.index, 1);
    }
    wx.setStorageSync('carts', JSON.stringify(carts));
    debugger;
    this.calTotal();
  }
})