var config = require('../../config/config.js');
var util = require('../../utils/util.js');

Page({
  data: {
    categories: [],
    categoryIndex: 0,
    itemWidth: '',
    page:1,
    isPullDown:false,
    totalPage:1,
    isLoading:false,
    products: []
  },
  onCategoryTap: function () {

  },
  getProducts: function (obj, that) {
    if (that.data.page-1<that.data.totalPage){ 
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      isLoading:true
    })
    var url = config.static.imageDomain+'/api/products?pageSize=' + obj.pageSize + '&currentPage=' + obj.currentPage;
    if (obj.type) {
      url = url + '&type=' + obj.type;
    }
    wx.request({
      url: url,
      method: "get",
      complete: function (res) {
        that.setData({
          isLoading: false
        })
      if (res.errMsg =='request:ok'){
        wx.hideLoading();
          var info = res["data"].products;
          info = info.map(function (item) {
            item.thumbnail = config.static.imageDomain + '/media/' + util.formatDate(item.thumbnail) + '/' + item.thumbnail._id + '/' + item.thumbnail.fileName;
            return item;
          });
          that.setData({
            page:that.data.page+1,
            totalPage: res.data.pages,
            products:that.data.products.concat(info)
          }) 
        }else{
          that.getProducts({ pageSize: 6, currentPage: 1 }, that);
        }
       
      },
      success: function (res) {
        if (res.data.code == 0) {
          resolve(res)
        }
      }
    });
    }
  },
  onProductTap: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/product/product?id=' + id
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
  onReachBottom(){
    var self = this;
    if(!this.data.isLoading){
      self.getProducts({ pageSize: 6, currentPage: self.data.page }, self);
    }
   
  },
  onPullDownRefresh(event){
    this.setData({
      isPullDown:true,
    })
    var that = this;
   setTimeout(function(){
     wx.stopPullDownRefresh();
     that.setData({
       isPullDown: false,
     })
   },2000)

  },
  bindload(event){
     console.log(event);
  }
})
