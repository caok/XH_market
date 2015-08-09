var config = require('./config');

var AlipayConfig = {
  // 合作身份者ID，以2088开头由16位纯数字组成的字符串
  partner:"2088xxxxxxxxxxxx",

// 交易安全检验码，由数字和字母组成的32位字符串
  key:"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",

// 签约支付宝账号或卖家收款支付宝帐户
  seller_email:"xxx@example.com",

// 支付宝服务器通知的页面 要用 http://格式的完整路径，不允许加?id:123这类自定义参数
// 必须保证其地址能够在互联网中访问的到(异步通知)
  //notify_url:"http://127.0.0.1:3000/paynotify",
  notify_url:"http://"+config.host+"/paynotify",

// 当前页面跳转后的页面 要用 http://格式的完整路径，不允许加?id:123这类自定义参数
// 域名不能写成http://localhost/create_direct_pay_by_user_jsp_utf8/return_url.jsp ，否则会导致return_url执行无效(同步通知)
  //return_url:"http://127.0.0.1:3000/payreturn",
  return_url:"http://"+config.host+"/payreturn",

//支付宝通知验证地址
  ALIPAY_HOST: "mapi.alipay.com",
  HTTPS_VERIFY_PATH: "/gateway.do?service=notify_verify&",
  ALIPAY_PATH:"gateway.do?",

// 调试用，创建TXT日志路径
  log_path:"~/alipay_log_.txt",

// 字符编码格式 目前支持 gbk 或 utf-8
  input_charset:"UTF-8",

// 签名方式 不需修改
  sign_type:"MD5"
};

module.exports = AlipayConfig;
