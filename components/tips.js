module.exports ={
  show:(that,title,delay,callback)=>{
    that.setData({
      title,
      isShow:true
    });
    delay && setTimeout(() => {
        that.setData({
          title:"",
          isShow: false
        })
        callback && callback();
    }, delay);
  }
  
}