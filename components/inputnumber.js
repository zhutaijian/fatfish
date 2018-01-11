function sub(that, v, d, index, count) {
  if (v > 0) {
    v = v - 1;
    that.setData({
      value: v
    })
    if (d) {
      if (index || index == 0) {
        that.data[d][index].count = v;
        that.setData({
          [d]: that.data[d]
        })
      } else {
        that.data[d].count = v;
        that.setData({
          [d]: that.data[d]
        })
      }
    }
  }

}
function add(that, v, d, index, count) {
 
  // that.setData({
  //   value: v
  // })

  if (d) {
    if (index || index == 0) {
      if (that.data[d][index].number > v) {
        v = v + 1;
        that.data[d][index].count = v;
        that.setData({
          value: v,
          [d]: that.data[d]
        })
        return { outNumber: false }
      }else{
        return {outNumber:true,count:v}
      }

    } else {
      if (that.data[d].number > v) {
        v = v + 1;
        that.data[d].count = v;
        that.setData({
          value:v,
          [d]: that.data[d]
        })
        return { outNumber: false }
      }else{
        return { outNumber: true, count: v }
      }
    }

  }
}
module.exports = {
  sub,
  add
}