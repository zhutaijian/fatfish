var util = require('../../utils/util.js');
var config = require('../../config/config.js');
var loader = require('../../components/loader.js');
var app = getApp();
Page({
  data: {
    keywrod: '',
    searchStatus: false,
    goodsList: [],
    hotKeyWord: [],
    helpKeyword: [],
    historyKeyword:[],
    categoryFilter: false,
    currentSortType: 'default',
    currentSortOrder: '',
    filterCategory: [],
    defaultKeyword: {},
    hotKeyword: [],
    page: 1,
    isLoaded:false,
    size: 20,
    currentSortType: 'id',
    currentSortOrder: 'desc',
    categoryId: 0
  },
  //事件处理函数
  closeSearch: function () {
    wx.navigateBack()
  },
  
  clearKeyword: function () {
    this.setData({
      keyword: '',
      searchStatus: false
    });
  },
  onShow(){
    this.setData({
      historyKeyword:JSON.parse(wx.getStorageSync("historyKeyWord") || "[]") || []
    });
  },
  onLoad: function () {
    this.getHotKeyWord();
  },
   getHotKeyWord(){
     let that = this;
     that.setData({
       hotKeyWord: app.configInfo.search_recommends
     })


   },
  getGoodsList: function () {
    let that = this;
    loader.show(that);
    wx.request({
      url: config.api.reqProductList,
      data:{
        keyword: that.data.keyword
      },
      method: "get",
      complete: function (res) {
        loader.hide(that,500);
       res.data.products.map(function(item){
         item.src = util.getRealImage(item);
          return item;
       });
       if (that.data.historyKeyword.indexOf(that.data.keyword)==-1){
         that.data.historyKeyword.push(that.data.keyword);
         that.setData({
           historyKeyword: that.data.historyKeyword
         })
         wx.setStorageSync('historyKeyWord', JSON.stringify(that.data.historyKeyword));
       }
       
       
        that.setData({
          isLoaded:true,
          searchStatus: true,
          categoryFilter: false,
          goodsList: res.data.products
        });

        // console.log(res);
      },
      success: function (res) {
        if (res.data.code == 0) {
          resolve(res.data)
        }
      }
    });
   
  },
  inputChange: function (e) {

    this.setData({
      keyword: e.detail.value,
      searchStatus: false
    });
   
  },
  onKeywordTap: function (event) {
    console.log(event.target.dataset.keyword);
    this.getSearchResult(event.target.dataset.keyword);

  },
  inputFocus: function () {
    this.setData({
      searchStatus: false,
      goodsList: []
    });

  },
  onKeywordTap: function (event) {

    this.getSearchResult(event.target.dataset.keyword);

  },
  getSearchResult(keyword) {
    this.setData({
      keyword: keyword,
      page: 1,
      categoryId: 0,
      goodsList: []
    });

    this.getGoodsList();
  },
  clearHistory(){
    var that = this;
    that.setData({
      historyKeyword:[]
    })
    wx.setStorageSync('historyKeyWord', "[]");

  },
  onKeywordConfirm(event) {
    this.getSearchResult(event.detail.value);
  }
})