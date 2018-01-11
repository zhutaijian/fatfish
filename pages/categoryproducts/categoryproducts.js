// pages/categoryproducts/categoryproducts.js
var utils = require('../../utils/util.js');
var config = require('../../config/config.js');
var inputNumber = require('../../components/inputnumber.js');
var tips = require('../../components/tips.js');
var loader = require('../../components/loader.js');
let productTypeService = require('../../service/product-type.service.js');
let app = getApp();
var deviceInfo = {};
var time = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    products: [],
    _index: 0,
    scrollTop: 0,
    animation: {},
    selectProducts: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let categories = app.configInfo.categories[options.id || 'fruit'].join(',')
    loader.show(that);
    productTypeService.api({ url: "get-some-product-types-products", method: "get", params: { productTypes: categories } }).then((res) => {
      that.setData({
        categories: res,
      });
      that.selectCategory({
        currentTarget: {
          dataset: {
            id: "",
            index: 0
          }
        }
      });
      loader.hide(that, 500);
    })
    utils.getDeviceInfo().then((res) => {
      deviceInfo = res;
    });
    this.calTotalCountAndPrice();
  },

  /**
   * 
   */



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }
  ,


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {

    var that = this;
    if (that.data.categories.length > 0) {
      that.selectCategory({
        currentTarget: {
          dataset: {
            id: "",
            index: getApp().selectCategoryIndex
          }
        }
      });
    }

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
  calTotalCountAndPrice() {
    var that = this;
    var obj = utils.calTotalCountAndPrice();
    that.setData(obj);
  },
  goToCart() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },
  selectCategory(event) {
    var id = event.currentTarget.dataset.id;
    var index = event.currentTarget.dataset.index;
    var that = this;
    that.data.categories[index].products = that.data.categories[index].products.filter(function (item) {
      item.src = utils.getRealImage(item);
      var _item = utils.getProductById(item._id);
      if (_item.length > 0) {
        item.count = _item[0].count;

      } else {
        item.count = 0;
      }
      if (item.number > 0) {
        return item;
      }

    });
    that.setData({
      scrollTop: 0,
      _index: index,
      selectProducts: that.data.categories[index].products
    })
    getApp().selectCategoryIndex = index;
  },
  onProductTap: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/product/product?id=' + id
    });
  },
  calK(x, y, x1, y1, x2, y2) {
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 0,
      timingFunction: "ease-in-out",
      delay: 0
    });
    this.animation = animation;
    let nStartY = y,
      nStartX = x,
      nEndY = y2 || 1.435 * deviceInfo.windowWidth,
      nEndX = x2 || 0.125 * deviceInfo.windowWidth,
      nTopX = x - 8,
      nTopY = y - 3;
    var a = ((nStartY - nEndY) * (nStartX - nTopX) - (nStartY - nTopY) * (nStartX - nEndX)) / ((nStartX * nStartX - nEndX * nEndX) * (nStartX - nTopX) - (nStartX * nStartX - nTopX * nTopX) * (nStartX - nEndX));
    var b = ((nEndY - nStartY) - a * (nEndX * nEndX - nStartX * nStartX)) / (nEndX - nStartX);
    var c = nStartY - a * nStartX * nStartX - b * nStartX;
    return { a, b, c };
  },
  move(param, step, i, productAX, productAY, callback) {
    var that = this;
    if (i > 5) {
      clearTimeout(time);
      setTimeout(() => {
        i = 0;
        that.setData({
          i
        })
      }, 300)

      callback && callback();
    } else {
      let x = productAX + step * i;
      that.setData({
        i,
        x: x,
        y: x * x * param.a + x * param.b + param.c
      })
      that.animation.translate3d(that.data.x, that.data.y, 0).step()
      that.setData({
        animationData: that.animation.export()
      })
      i++;
      time = setTimeout(that.move.bind(that, param, step, i, productAX, productAY, callback), 100);
    }

  },
  add(event) {
    var productAX = event.detail.x;
    var productAY = event.detail.y;
    var param = this.calK(productAX, productAY);
    var index = event.currentTarget.dataset.index;
    var selectProduct = this.data.selectProducts[index];
    var that = this;
    var i = 0, step = (0.125 * deviceInfo.windowWidth - productAX) / 5;
    that.move(param, step, i, productAX, productAY, () => {
      selectProduct.count = selectProduct.count || 0;
      inputNumber.add(this, selectProduct.count, 'selectProducts', index, 'count');
      tips.show(that, '加入购物车成功', 500);
      utils.onAddToCartTap(selectProduct._id, { thumbnail: selectProduct.src, title: selectProduct.title, price: selectProduct.price });
      that.calTotalCountAndPrice();
    });

  },
  sub(event) {
    var carts = wx.getStorageSync('carts') != '' ? JSON.parse(wx.getStorageSync('carts')) : [];
    var index = event.currentTarget.dataset.index;
    var selectProduct = this.data.selectProducts[index];
    inputNumber.sub(this, selectProduct.count, 'selectProducts', index, 'count');
    var obj = utils.getProductById(selectProduct._id)[0];
    carts[obj.index] = Object.assign({}, obj, { count: selectProduct.count });
    if (selectProduct.count == 0) {
      carts.splice(obj.index, 1);
    }
    wx.setStorageSync('carts', JSON.stringify(carts));
    this.calTotalCountAndPrice();
  },
  binderror(e) {
   // tips.show(that, JSON.stringify(e.detail.errMsg), 500);
  }
})