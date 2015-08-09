var md5 = require('./lib').md5;
var mongoose = require('mongoose');
var models = require('./models');
var Admin = models.Admin;
var Company = models.Company;
var User = models.User;
var Order = models.Order;

User.remove({}, function (err) {
  if (err) return console.log(err);
});

Admin.remove({}, function (err) {
  if (err) return console.log(err);
});

Order.remove({}, function (err) {
  if (err) return console.log(err);
});

var admin = new Admin();
admin.name = "admin";
admin.password = md5("password");
admin.save(function(err){
  if (err) {
    return console.log(err);
  }
  console.log("Admin seed success!");
});

Company.remove({}, function (err) {
  if (err) return console.log(err);
});

//联系我们
var contact = new Company();
contact.title = "contact";
contact.content = { email:"whc@xhsports.com",
                    tel:"0512 8888 0000",
                    fax:"0512 5893 5068",
                    address:{zh:'江苏省张家港市金港镇镇山西路', en:'123456'}
                  };
contact.save(function(err){
  if (err) {
    return console.log(err);
  }
  console.log("contact seed success!");
});

//大图与运费规则
var basicinfo = new Company();
basicinfo.title = "basicinfo";
basicinfo.content = {};
basicinfo.content.indexImg = "";
basicinfo.content.otherImg = "";
basicinfo.content.tel = "0512 - 8888 0000";
basicinfo.content.freight = 0;
basicinfo.content.freeCondition = 100;
basicinfo.save(function(err){
  if (err) {
    return console.log(err);
  }
  console.log("basicinfo seed success!");
});

//合作伙伴
var partner = new Company();
partner.title = "partner";
partner.content = [];
partner.save(function(err){
  if (err) {
    return console.log(err);
  }
  console.log("partner seed success!");
});

//关于我们
var about = new Company();
about.title = "about";
about.content = {zh:'', en:''};
about.save(function(err){
  if (err) {
    return console.log(err);
  }
  console.log("about seed success!");
});

//发货信息
var delivery = new Company();
delivery.title = "delivery";
delivery.content = {zh:'', en:''};
delivery.save(function(err){
  if (err) {
    return console.log(err);
  }
  console.log("delivery seed success!");
});

//退货退款
var refund = new Company();
refund.title = "refund";
refund.content = {zh:'', en:''};
refund.save(function(err){
  if (err) {
    return console.log(err);
  }
  console.log("refund seed success!");
});

//保修
var warranty = new Company();
warranty.title = "warranty";
warranty.content = {zh:'', en:''};
warranty.save(function(err){
  if (err) {
    return console.log(err);
  }
  console.log("warranty seed success!");
});

//加入我们
var joinus = new Company();
joinus.title = "joinus";
joinus.content = {zh:'', en:''};
joinus.save(function(err){
  if (err) {
    return console.log(err);
  }
  console.log("joinus seed success!");
});

//男子选购指引
var manguide = new Company();
manguide.title = "manguide";
manguide.content = {zh:'', en:''};
manguide.save(function(err){
  if (err) {
    return console.log(err);
  }
  console.log("manguide seed success!");
});

var womanguide = new Company();
womanguide.title = "womanguide";
womanguide.content = {zh:'', en:''};
womanguide.save(function(err){
  if (err) {
    return console.log(err);
  }
  console.log("womanguide seed success!");
});

//尺码说明
var sizedesc = new Company();
sizedesc.title = "sizedesc";
sizedesc.content = {zh:'', en:''};
sizedesc.save(function(err){
  if (err) {
    return console.log(err);
  }
  console.log("sizedesc seed success!");
});

//mongoose.disconnect();
