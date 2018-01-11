var config = require('../config/config.js');
function formatTime(date) {
  date = new Date(date)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/');
  // + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function formatDate(str) {
  var date = new Date(str.date);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if (parseInt(month) < 10) {
    month = "0" + month;
  }
  if (parseInt(day) < 10) {
    day = "0" + day;
  }
  return year + "" + month;
}
function getRealImage(pro) {
  if (pro.thumbnail){
  var image_src = "https://www.woaifruit.com" + '/v2/media/' + formatDate(pro.thumbnail) + '/' + pro.thumbnail._id + '/' + pro.thumbnail.fileName;
  return image_src;
  }else{
    return '';
  }
  

}
function timego(value) {
  var createDate = new Date(value).getTime();
  var second = 1000;
  var minute = second * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var cur = new Date().getTime();
  var dateMinus = (cur - createDate);
  if (dateMinus == 0 || (dateMinus / second > 0 && dateMinus / minute <= 1)) {
    return "刚刚";
  }
  if (dateMinus / minute > 1 && dateMinus / hour < 1) {
    return Math.floor(dateMinus / minute) + "分钟前";
  }
  if (dateMinus / hour > 1 && dateMinus / day < 1) {
    return Math.floor(dateMinus / hour) + "小时前";
  }
  if (dateMinus / day > 1 && dateMinus / day < 20) {
    return Math.floor(dateMinus / day) + "天前";
  } else {
    return formatTime(value);
  }
}
function findProById(id, list) {
  if (arguments.length == 1) {
    var arr = wx.getStorageSync('carts') || [];
  } else {
    var arr = list || [];
  }
  return arr.filter(function (item, i) {
    if (item._id === id) {
      item.cartIndex = i;
      return item;
    }
  })
}
function addCart(pro) {
  var carts = wx.getStorageSync('carts') || [];
  var productss = findProById(pro._id);
  if (productss.length > 0 && productss[0]) {
    carts[productss[0].cartIndex] = {
      _id: pro._id,
      title: pro.title,
      price: pro.price,
      count: pro.count,
      cartIndex: pro.cartIndex,
      src: pro.src ? pro.src : getRealImage(pro)
    };
  } else {
    carts.push({
      _id: pro._id,
      title: pro.title,
      price: pro.price,
      count: pro.count,
      cartIndex: carts.length,
      src: pro.src ? pro.src : getRealImage(pro)
    })
  }
  wx.setStorageSync("carts", carts);

}
function removeCart(pro) {
  var carts = wx.getStorageSync('carts') || [];
  carts.splice(pro.cartIndex, 1, 1);
  wx.setStorageSync("carts", carts);
}
function carProNumOfCart() {
  var carts = wx.getStorageSync('carts') || [];
  var count = 0;
  carts.map(function (item) {
    count = count + parseInt(item.count);
  });
  // wx.setStorageSync("cartcount",count);
  return count;

}
function obj2json(obj) {
  var str = "";
  for (var key in obj) {
    str = str + "&" + key + "=" + obj[key];
  }
  str = str.substr(1);
  return str;
}
function isReading(moduleName, itemId, userId) {
  const key = moduleName + "_" + itemId + "_" + userId;
  var _isReading = wx.getStorageSync(key) || false;
  return _isReading;
}
function setMoudleReading(moduleName, itemId, userId, val) {
  const key = moduleName + "_" + itemId + "_" + userId;
  var isReading = wx.getStorageSync(key) || false;
  wx.setStorageSync(key, val);
}
function generateTimeList() {
  var workrange = [9, 18];
  var m = new Date().Format('mm'),
    h = parseInt(new Date().Format('hh'));
  var arr = []
  if (m > 30) {
    h = h + 1;
  };
  if (h < workrange[0]) {
    h = workrange[0]
  }
  if (h < workrange[1]) {
    for (var a = workrange[1] - 1; a > h - 1; a--) {
      var str = a;
      if (a < 10) {
        str = "0" + a;
      }
      arr.push(str + ":00到" + (parseInt(str) + 1) + ":00")
    }
    arr = arr.reverse();
  }
  for (var i = workrange[0]; i < workrange[1]; i++) {
    var str = i;
    if (i < 10) {
      str = "0" + i;
    }
    arr.push("明天" + str + ":00到" + (parseInt(str) + 1) + ":00")
  }
  return arr;


}
function collectOneField(list, field) {
  return list.map((item, index) => {
    return item[field];
  });


}
function getProductById(productId) {
  var carts = wx.getStorageSync('carts') != '' ? JSON.parse(wx.getStorageSync('carts')) : [];
  var temp = [];
  carts.forEach((item, index) => {
    if (item._id == productId) {
      item.index = index;
      temp.push(item);
    }
  })
  return temp;
}
function onAddToCartTap(productId, product) {
  // var productId = this.data.product._id;
  var app = getApp();
  var carts = wx.getStorageSync('carts') != '' ? JSON.parse(wx.getStorageSync('carts')) : [];
  var _index = 0;
  var totalCount = 0;
  var productitem = carts.map((item, index) => {
    totalCount = totalCount + item.count;
    if (item._id == productId) {
      _index = index;
      return item;
    } else {
      return {}
    }
  });
  var _arr = [];
  productitem.forEach(function (value, index, array) {
    if (value._id) {
      _arr.push(value);
    }
  });
  productitem = _arr;
  if (productitem.length == 0) {
    carts.push({ _id: productId, checked: true, count: 1, title: product.title, price: product.price, url: product.thumbnail });
  } else {
    productitem[0].count++;
    carts.splice(_index, 1, productitem[0]);
  }
  wx.setStorageSync('carts', JSON.stringify(carts));
}
function accAdd(arg1, arg2) {
  var r1, r2, m;
  try { r1 = arg1.toString().split()[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split()[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}
function accSub(arg1, arg2) {
  var r1, r2, m, n;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2));
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
function getDeviceInfo() {
  return new Promise(function (resolve, reject) {
    wx.getSystemInfo({
      success: function (res) {
        resolve(res);
      }
    })
  })
}
function cartAnimation() {



}
function getOneCategoryById(that, id) {
  let arr = getApp().configInfo.product_recommends;
  let random = Math.floor(Math.random(0, 1) * arr.length);
  id = id || arr[random];
  return new Promise((reslove, reject) => {
    wx.request({
      url: config.api.getCategoryProduct + "?type=" + id,
      method: "get",
      complete: function (res) {
        if (res.errMsg == 'request:ok') {
          res.data.src = getRealImage({ thumbnail: res.data.banner });
          res.data.products = res.data.products.map(function (item) {
            item.src = getRealImage(item);
            return item;
          });
          that.setData({
            toData: res.data
          })
          reslove(res.data);
        } else {

        }

      }
    });
  })

}
function calTotalCountAndPrice() {
  var totalCount = 0, totalPrice = 0;
  var carts = wx.getStorageSync('carts') != '' ? JSON.parse(wx.getStorageSync('carts')) : [];
  carts.filter((item) => {
    if (item.checked) {
      totalPrice = Number(totalPrice).add(Math.round(item.price * 100) / 100 * item.count);
      totalCount = totalCount + item.count;
    }
  });
  return {
    totalPrice,
    totalCount
  };
}
function checkCouponValid(item, totalPrice) {
  var { coupon: { expireTimeBegin, expireTimeEnd, usedLimit, amount } } = item;
  var thisDate = new Date().getTime();
  expireTimeBegin = new Date(expireTimeBegin).getTime();
  expireTimeEnd = new Date(expireTimeEnd).getTime();
  if (expireTimeBegin <= thisDate && thisDate <= expireTimeEnd && usedLimit <= totalPrice) {
    return true;
  } else {
    return false
  }
}
module.exports = {
  collectOneField,
  accSub,
  getProductById,
  onAddToCartTap,
  generateTimeList,
  formatTime,
  formatDate,
  timego,
  addCart,
  removeCart,
  findProById,
  getRealImage,
  obj2json,
  setMoudleReading,
  isReading,
  getDeviceInfo,
  cartAnimation,
  carProNumOfCart,
  calTotalCountAndPrice,
  getOneCategoryById,
  checkCouponValid
}

