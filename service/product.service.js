let baseService = require("./base.service.js");
function api({ url, method='get', params={}, data={}}) {
  return baseService.service({ url: "/products" + url, method, params, data })
}
module.exports = {
  api
}