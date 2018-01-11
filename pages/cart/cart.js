var config = require('../../config/config.js');
var inputNumber = require('../../components/inputnumber.js');
var utils = require('../../utils/util.js');
var tips = require('../../components/tips.js');
var loader = require('../../components/loader.js');
var app = getApp();
var carts;
var x1, y1, x2, y2;
var app = getApp();
Page({
  data: {
    appName: config.name,
    totalPrice: 0,
    checkedIcon: '../../icons/check.png',
    uncheckIcon: '../../icons/uncheck.png',
    editStatus: false,
    carts: [],
    scrollHeight:0,
    selectedDate:"30分钟可送达",
    allChecked: false,
    array: utils.generateTimeList()
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
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
  gotoBuy:function(){
 
    wx.navigateTo({
      url: '/pages/categoryproducts/categoryproducts'
    })


  },
  onShow: function () {
   
      carts = wx.getStorageSync('carts') != '' ? JSON.parse(wx.getStorageSync('carts')) : [];
      this.checkAllProducts((res) => {
        // console.log(res.data);
        var formatProducts = res.data;
        var count = 0;
        carts = carts.map(function (item) {
          item.deleteStatus = undefined;
          var index = utils.findProById(item._id, formatProducts)[0].cartIndex;
          var $item = formatProducts[index];
          item.price = $item.price;
          item.number = $item.number;
          item.count = Math.min(item.count, $item.number);
          item.islimitproduct = $item.islimitproduct;
          $item.total = item.buyed = $item.total || 0;
          item.limit = $item.limit;
          if (formatProducts[index].islimitproduct) {
            item.count = Math.min(item.count, $item.limit - $item.total)
          }
          if (item.checked) {
            count++;
          }
          return item;
        })
        this.setData({
          carts: carts,
          allChecked: count == carts.length
        });
        this.isOneCheck()
        this.calTotalPrice();
      });
      if (carts.length == 0) {
        this.setData({
          carts: [],
          allChecked: false
        });
        var that = this;
        loader.show(this);
      
        utils.getOneCategoryById(that).then(()=>loader.hide(that,1));
      }

   
    
   
  },
  isAllChecked() {
    var that = this, count = 0;
    that.data.carts.map(function (_item) {
      if (_item.checked) {
        count++;
      }
    })
    return that.data.carts.length == count;
  },
  onLoad: function () {
    setTimeout(()=>{
      utils.getDeviceInfo().then((res) => {
        this.setData({
          scrollHeight: res.windowHeight - (70 / 375) * res.windowWidth,
          address: wx.getStorageSync("user_address"),
          username: wx.getStorageSync("username"),
          telNumber: wx.getStorageSync("telNumber")
        })
      });

    },200)
    
  },
  jiesuan() {
    // var that = this;
    // if (!this.data.address){
    //   wx.showModal({
    //     title: '提示',
    //     content: '请先选择你要收货的地址',
    //     showCancel: false,
    //     success: function (res) {

    //     }
    //   })
    //   return;
    // }
    if (this.calTotalPrice() > 0) {
      wx.navigateTo({
        url: '/pages/confirmorder/confirmorder?time='
      });
    
    } else {
      wx.showToast({
        title: '请先选择你要结算的商品',
        icon: 'success',
        duration: 2000
      })
    }

  },
  add(event) {
    var index = event.currentTarget.dataset.index;
    var item = this.data.carts[index];
    if (item.islimitproduct && (item.count+item.buyed)>=item.limit){
      tips.show(this, '你已经购买很多啦', 1000);
       return ;
    }
    inputNumber.add(this, item.count, 'carts', index, 'count');
    wx.setStorageSync('carts', JSON.stringify(this.data.carts));
    this.calTotalPrice();
  },
  sub(event) {
    var index = event.currentTarget.dataset.index;
    if (this.data.carts[index].count == 1) {
       this.deleteProduct(event);
    }else{
      inputNumber.sub(this, this.data.carts[index].count, 'carts', index, 'count');
      wx.setStorageSync('carts', JSON.stringify(this.data.carts));
      this.calTotalPrice();
    }
   
    
    
   
    
  },
  checkAllProducts(callback){
    
    var _ids = utils.collectOneField(carts, '_id');
    if(_ids.length==0){
      return;
    }
    var url = config.api.getProductsByIds + "?ids=" + utils.collectOneField(carts, '_id') + "&openid=" + wx.getStorageSync('openid') ;
    
    
    wx.request({
      url: url,
      method: "get",
      complete:  (res)=> {
        loader.hide(this, 1)
        callback && callback(res);

      },
      success: function (res) {
        if (res.data.code == 0) {
          resolve(res)
        }
      }
    });


  },
  calTotalPrice() {
    var that = this;
    var totalPrice = 0;
    that.data.carts.filter(function (item) {
      if (item.checked) {
        totalPrice = Number(totalPrice).add(Math.round(item.price*100)/100 * item.count);
      }
    });
    totalPrice = Math.round(totalPrice * 100) / 100 
    that.setData({
      totalPrice: totalPrice
    })
    if (that.data.carts.length==0){
      var that = this;
      utils.getOneCategoryById(that, "5a51ca661901e56d0a168331").then(()=>loader.hide(that,1));
    }
    return totalPrice;
  },
  checkItem(event) {
    var that = this;
    var index = event.currentTarget.dataset.index;
    var checked = event.currentTarget.dataset.checked;
    var item = that.data.carts[index];
    item.checked = JSON.parse(checked);
    if (item.checked) {
      that.setData({
        carts: that.data.carts,
         totalPrice:Number(that.data.totalPrice).add(Math.round(item.price * 100) / 100 * item.count)
      })
      that.setData({
        allChecked: that.isAllChecked()
      });
    } else {
      that.setData({
        carts: that.data.carts,
        allChecked: false,
        totalPrice: Number(that.data.totalPrice).sub(Math.round(item.price * 100) / 100 * item.count)
      })
     
    }
    that.isOneCheck();
    wx.setStorageSync('carts', JSON.stringify(this.data.carts));
  },
  isOneCheck(){
    var that = this;
    var arrs = that.data.carts.filter(function(item) {
      if (item.checked) {
        return 1
      }
    })
    that.setData({
      isChecked: arrs.length > 0
    })

  },
  checkAllItem(event) {
    var that = this;
    var checked = JSON.parse(event.currentTarget.dataset.checked);
    var carts = that.data.carts.map(function (item) {
      item.checked = checked;
      return item;
    })
    that.setData({
      carts: carts,
      allChecked: checked,
      isChecked: checked
    });
    that.calTotalPrice()
    wx.setStorageSync('carts', JSON.stringify(this.data.carts));

  },
  editCart() {
    this.setData({
      editStatus: !this.data.editStatus
    })
  },

  gotoproduct(event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/product/product?id=' + id
    });
  },
  deleteProduct(event) {
    var index = event.currentTarget.dataset.index;
    var self = this;
    wx.showModal({
      title: '提示',
      content: '你确定要从购物车删除该商品吗',
      success: function (res) {
        if (res.confirm) {
          self.data.carts.splice(index, 1);
          self.setData({
            carts: self.data.carts
          });
          wx.setStorageSync('carts', JSON.stringify(self.data.carts));
          self.calTotalPrice();
        } else if (res.cancel) {
          self.data.carts[index]['deleteStatus'] = false;
          self.setData({
            carts: self.data.carts
          });
         self.isOneCheck()
        }
      }
    })


  },
 
  touchstart(event) {

    x1 = event.changedTouches[0].clientX;
    y1 = event.changedTouches[0].clientY;
   
  },
  touchmove(event) {

  },
  touchend(event) {
    var index = event.currentTarget.dataset.index;
    x2 = event.changedTouches[0].clientX;
    y2 = event.changedTouches[0].clientY;
    if (Math.abs(x1 - x2) > Math.abs(y1 - y2)) {
      if (x1 > x2) {
        this.data.carts[index]['deleteStatus'] = true
        this.setData({
          carts: this.data.carts
        })
      } else {
        this.data.carts[index]['deleteStatus'] = false;
        this.setData({
          carts: this.data.carts
        })
      }
    }

  },
  onProductTap: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/product/product?id=' + id
    });
  }
})