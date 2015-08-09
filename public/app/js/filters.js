angular.module('myApp.filters', []).filter('orderstatus', function() {
  return function(state) {
    var status = "";
    switch(parseInt(state)){
      case 0:
        status = "未付款";
        break;
      case 1:
        status = "已付款，未发货";
        break;
      case 2:
        status = "已发货, 未收货";
        break;
      case 3:
        status = "已收货，未评价";
        break;
      case 4:
        status = "已评价";
        break;
      case 5:
        status = "正在退货";
        break;
      case 6:
        status = "退货成功";
        break;
      case 7:
        status = "关闭";
        break;
    }
    return status;
  };
}).filter('delHtmlTag', function() {
  return function(str){
    str = String(str);
    return str.replace(/<[^>]+>/g,"");
  };
});
