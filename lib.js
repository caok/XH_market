var crypto = require('crypto');

exports.md5 = function(str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
};

// 动态生成密码追回密钥
exports.randomString = function randomString(size) {
  size = size || 6;
  var code_string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var max_num = code_string.length + 1;
  var key = '';
  while (size > 0) {
    key += code_string.charAt(Math.floor(Math.random() * max_num));
    size--;
  }
  return key;
};

// 格式化日期
exports.format_datetime = function (date, friendly){
  if (!date){
    return "";
  };
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  if (friendly) {
    var now = new Date();
    var mseconds = -(date.getTime() - now.getTime());
    var time_std = [ 1000, 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000 ];
    if (mseconds < time_std[3]) {
      if (mseconds > 0 && mseconds < time_std[1]) {
        return Math.floor(mseconds / time_std[0]).toString() + ' 秒前';
      }
      if (mseconds > time_std[1] && mseconds < time_std[2]) {
        return Math.floor(mseconds / time_std[1]).toString() + ' 分钟前';
      }
      if (mseconds > time_std[2]) {
        return Math.floor(mseconds / time_std[2]).toString() + ' 小时前';
      }
    }
  }

  //month = ((month < 10) ? '0' : '') + month;
  //day = ((day < 10) ? '0' : '') + day;
  hour = ((hour < 10) ? '0' : '') + hour;
  minute = ((minute < 10) ? '0' : '') + minute;
  second = ((second < 10) ? '0': '') + second;

  //var thisYear = new Date().getFullYear();
  //year = (thisYear === year) ? '' : (year + '-');
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
};

// 格式化月份
exports.format_month = function (month){
  var mon = "";
  switch(parseInt(month)){
    case 0:
      mon = "Jan";
      break;
    case 1:
      mon = "Feb";
      break;
    case 2:
      mon = "Mar";
      break;
    case 3:
      mon = "Apr";
      break;
    case 4:
      mon = "May";
      break;
    case 5:
      mon = "Jun";
      break;
    case 6:
      mon = "Jul";
      break;
    case 7:
      mon = "Aug";
      break;
    case 8:
      mon = "Sep";
      break;
    case 9:
      mon = "Oct";
      break;
    case 10:
      mon = "nov";
      break;
    case 11:
      mon = "Dec";
      break;
  }
  return mon;
};

// 格式化订单状态
exports.format_orderstate = function (state){
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
