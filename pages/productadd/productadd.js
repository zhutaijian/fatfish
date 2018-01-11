// pages/productadd/productadd.js
var config = require('../../config/config.js');
var windowHeight =1000;
var utils = require('../../utils/util.js');
var media = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:"",
    selectType:"",
    viewType:"add",
    thumb:{},
    media:[],
    urlprefix: config.static.imageDomain,
    stock:100,
    categories:[],
    expireTime:"1",
    selectProductStatus:"0",
    brand:"小苹果",
    weightUnits: config.dict.weightUnits,
    productStatus: config.dict.productStatus
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        debugger;
        that.setData({
          windowHeight: res.windowHeight*2-120
        })
        //windowHeight =   res.windowHeight;
      }
    })
    wx.setNavigationBarTitle({
      title: "新增商品"
    });
    var that = this;
    wx.request({
      url: config.api.getAllProductTypes,
      method: "get",
      complete: function (res) {
         that.setData({
           categories: res.data
         })
      },
      success: function (res) {
        if (res.data.code == 0) {
          resolve(res)
        }
      }
    });
  },
  bindinput(event){
    this.setData({
      [event.currentTarget.dataset.name]: event.detail.value
    })

  },
  bindchange(event,type){
   this.setData({
     [event.currentTarget.dataset.name]:event.detail.value
   })

  },
  deleteThumb(){
    this.setData({
      thumb:{}
    })


  },
  openScan(){
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        that.setData({
         scanCode:res.result
       })
      }
    })
  },
  submitProduct(){
    var that = this;
    var selectType = that.data.selectType;
    var selectUnit = that.data.selectUnit;
    var selectProductStatus = that.data.selectProductStatus;
    
    wx.request({
      url: config.api.saveProduct,
      method: "post",
      data: { 
        media: utils.collectOneField(that.data.media,"_id"),
        user:"57e5e3c88f0f3405cca46443",
        thumbnail:that.data.thumb._id,
        brand: that.data.brand,
        weight: that.data.weight,
        addsource:"miniprogram",
        title:that.data.title,
        price:that.data.price,
        desc: that.data.desc,
        number: that.data.stock,
        scancode: that.data.scancode,
        weightUnit: that.data.weightUnits[selectUnit].key,
        productType: that.data.categories[selectType]._id,
        status: that.data.productStatus[selectProductStatus].key,
        expireTime: that.data.expireTime
       },
      complete: function (res) {
         that.setData({
            viewType:"success"
         })
      },
      success: function (res) {
        if (res.data.code == 0) {
          resolve(res)
        }
      }
    });
    


  },
  goToAdd(){
    this.setData({
      viewType: "add",
      thumb:"",
      media:[],
      brand: "",
      weight: "",
      desc:"",
      title:"",
      price: "",
      number: 100,
      scancode: "",
      selectUnit: 0,
      selectType:0,
      selectProductStatus: 0,
      expireTime: 1
    })


  },
  uploadFile(i,fileArr){
    if(i==fileArr.length){
      return ;
    }
    var that = this;
    wx.uploadFile({
      url: 'https://www.woaifruit.com/api/media', //开发者服务器 url
      filePath: fileArr[i],//要上传文件资源的路径
      name: 'file', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
      formData: { //HTTP 请求中其他额外的 form data
        'user': 'test'
      },
      success: function (res) {
        var data = res.data;
        media.push(JSON.parse(res.data));
        that.setData({
          media: media
        })
        i++;
        that.uploadFile(i, fileArr);
      }
    })
  },
  deleteOneMedia(event){

    this.data.media.splice(event.currentTarget.dataset.index,1);
       this.setData({
         media:this.data.media
       })


  },
  openMedia(){
    var that = this;
    wx.chooseImage({
      count: 4-that.data.media.length, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
         
        that.uploadFile(0, tempFilePaths);

      }
    })

  },
  openThumb(){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        wx.uploadFile({
          url: 'https://www.woaifruit.com/api/media?type=compress', //开发者服务器 url
          filePath: tempFilePaths[0],//要上传文件资源的路径
          name: 'file', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
          formData: { //HTTP 请求中其他额外的 form data
            'user': 'test'
          },
          success: function (res) {
            var data = res.data;
            that.setData({
              thumb: JSON.parse(res.data)
            })
            //do something
          }
        })

      }
    })
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