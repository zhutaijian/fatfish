let baseService =  require("./base.service.js");
 function getConfig(){
  return  baseService.service({ url: "/customer-config", method:"get"})
}

module.exports ={
  getConfig
}