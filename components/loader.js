function changeLoaderIcon(that, i) {
  that.setData({
    positionY: -i * 2.5
  });
  i++;
  if (i == 4) {
    i = 0;
  }
  clearTimeout(that.data.timeout);
  var timeout = setTimeout(() => changeLoaderIcon(that, i),1000);
  that.setData({
    timeout
  })
}
module.exports = {
  show: (that) => {
    that.setData({
      timeout:0,
      isShowLoader: true
    });
    var i = Math.floor(Math.random(0, 1) * 4);
    changeLoaderIcon(that, i);
  },
  hide: (that, delay, callback) => {
    delay && setTimeout(() => {
      that.setData({
        isShowLoader: false
      })
      callback && callback();
    }, delay);
  }

}