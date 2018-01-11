var config = require('../../config/config.js');
var util = require('../../utils/util.js');
var inputNumber = require('../../components/inputnumber.js');
var loader = require('../../components/loader.js');
var carts = wx.getStorageSync('carts') != '' ? JSON.parse(wx.getStorageSync('carts')) : [];
Page({
  data: {
    categories: [],
    categoryIndex: 0,
    itemWidth: '',
    page: 1,
    flg: true,
    homeBanners: [],
    homeCategory: [],
    isPullDown: false,
    totalPage: 1,
    isLoading: false,
    products: []
  },
  onCategoryTap: function () {

  },
  tap: function (e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1]
        })
        break
      }
    }
  },
  openNotice(){
    wx.showModal({
      title: '公告',
      content: '配送范围，目前仅限太仓市区。因恶劣天气导致有所延误请谅解，配送至楼下，不上楼。配送时间，早上九点至下午五点半',
      showCancel:false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  },
  openCoupon(){
    

  },
  closeCoupon(){



  },
  buildHomeData(d) {
    var homeArr = [];
    var homeBannerArr = [];

    d.filter(function (item) {
      if (item.viewPosition.indexOf("homeBanner") > -1) {
        item.thumbnail = item.banner;
        item.src = util.getRealImage(item);
        homeBannerArr.push(item);
      }
      else if (item.viewPosition.indexOf("home") > -1) {
       
        item.src = util.getRealImage({
          thumbnail: item.banner
        });
          item.products=  item.products.filter(function ($item, index) {
          $item.src = util.getRealImage($item);
          if ($item.number > 0) {
           // item.products[index] = $item;
            return $item;
          }

        })

        homeArr.push(item);
      }
    })
    this.setData({
      isLoading:false,
      homeCategory: homeArr,
      homeBanners: homeBannerArr
    })


  },
  getProducts: function (obj, that) {
    // wx.showLoading({
    //   title: '加载中',
    // });
    loader.show(this);
    this.setData({
      isLoading:true
    });
    var that =this;
    wx.request({
      url: config.api.getHomeInfo+"&limit=6",
      method: "get",
      complete: function (res) {
        wx.hideLoading();
        if (res.errMsg == 'request:ok') {
          loader.hide(that,1);
          that.buildHomeData(res.data);
        } else {

        }

      },
      success: function (res) {
        if (res.data.code == 0) {
          resolve(res)
        }
      }
    });
  },
  onProductTap: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/product/product?id=' + id
    });
  },
  onCategoryTap(event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/recommendproducts/recommendproducts?id=' + id
    });

  },
  onLoad: function () {
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          itemWidth: (res.screenWidth - 40) / 2 + 'px'
        });

      }
    });
    self.getProducts({ pageSize: 6, currentPage: 1 }, self);
  },
  onShareAppMessage: function () {

  },
  add(event) {
    var index = event.currentTarget.dataset.index;
    var selectProduct = this.data.selectProducts[index];
    selectProduct.count = selectProduct.count || 0;
    inputNumber.add(this, selectProduct.count, 'selectProducts', index, 'count');
    wx.showToast({
      title: '加入购车成功！',
      icon: 'success',
      duration: 1000
    })
    utils.onAddToCartTap(selectProduct._id, { thumbnail: selectProduct.src, title: selectProduct.title, price: selectProduct.price });
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
  }
})
