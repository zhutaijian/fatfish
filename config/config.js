var url       = 'https://www.woaifruit.com';
var apiPrefix = url + '/api/v2';

var config = {
    name: "胖鱼商城",
    wemallSession: "wemallSession",
    static: {
      imageDomain: url 
    },
    api: {
        getHomeInfo:"/product-type/get-all-products?home=true",
        weAppLogin: '/wechat/login',
        weUserInfoBind:"/wechat/get-user-phone",
        isSetUser:'/account/is-user-exist',
        setWeAppUser: '/account/set-user',
        reqCategoryList: '/categories?status=normal',
        reqProductList: '/products',
        reqProductDetail: '/products/:id',
        addToCart: '/cart/create',
        createOrder:'/orders',
        queryOrder:'/orders',
        getProductsByIds:'/products/some',
        accountAddress:'/account-address',
        getCategoryProduct:"/product-type/get-one-type-product",
        getAllProductsAndType:'/product-type/get-all-products?status=normal',
        sendTemplateMsg:'/wechat/send-template-msg',
        getAllProductTypes:"/product-type?status=normal",
        saveProduct:"/products",
        getCustomer:'/customer-config',
        getLimitProductCount:"/orders/cal-user-limit-product-buy-count",
        getLimitTimeBuy:"/limit-time-buy",
        getCoupons:"/account-coupon"
    },
    sendTemplateMsg(data,callback){
      wx.request({
        url: this.api.sendTemplateMsg,
        method: "post",
        data:data,
        success: function (res) {
          callback && callback(res);
        }

      });
    }
};

for (var key in config.api) {
    config.api[key] = apiPrefix + config.api[key];
}
config.dict={
  productStatus: [{
    key: 'pushed',
    value: "上架"

  }, {
    value: "下架",
    key: "delete"
    }, {
      value: "预售",
      key: "feture"
    }],
  weightUnits: [{
    key: 'kg',
    value: "公斤"
  }, {
    key: 'g',
    value: "克"
  }, {
    key: 'ml',
    value: "毫升"
  }, {
    key: 'L',
    value: "升"
  }]
}
module.exports = config;