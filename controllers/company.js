var mail = require('../services/mail');
var models = require('../models');
var Company = models.Company;

exports.about = function (req, res, next) {
  Company.findOne({title: "about"}, function(err, about){
    if (err) {
      return next(err);
    }
    res.render('company/about', { about: about, title: '关于我们' });
  });
};

exports.partner = function (req, res, next) {
  Company.findOne({title: "partner"}, function(err, partner){
    if (err) {
      return next(err);
    }
    res.render('company/partner', { partner: partner, title: '合作伙伴' });
  });
};

exports.contact = function (req, res, next) {
    Company.findOne({title: "contact"}, function(err, contact){
        if (err) {
      return next(err);
    }
    res.render('company/contact', { contact: contact, title: '联系我们' });
  });
};

exports.contactMail = function (req, res, next){
    var zhuti = req.body.theme.trim();
    var name = req.body.name.trim();
    var email = req.body.email.trim();
    var message = req.body.message.trim();
    mail.sendContactMail(zhuti,name,email,message);
    res.render('company/contact', {
        success: name
    });
};

exports.delivery = function (req, res, next) {
  Company.findOne({title: "delivery"}, function(err, delivery){
    if (err) {
      return next(err);
    }
    res.render('company/delivery', { delivery: delivery, title: '发货信息' });
  });
};

exports.refund = function (req, res, next) {
  Company.findOne({title: "refund"}, function(err, refund){
    if (err) {
      return next(err);
    }
    res.render('company/refund', { refund: refund, title: '退货退款' });
  });
};

exports.warranty = function (req, res, next) {
  Company.findOne({title: "warranty"}, function(err, warranty){
    if (err) {
      return next(err);
    }
    res.render('company/warranty', { warranty: warranty });
  });
};

exports.joinus = function (req, res, next) {
  Company.findOne({title: "joinus"}, function(err, joinus){
    if (err) {
      return next(err);
    }
    res.render('company/joinus', { joinus: joinus });
  });
};

exports.manguide = function (req, res, next) {
  Company.findOne({title: "manguide"}, function(err, manguide){
    if (err) {
      return next(err);
    }
    res.render('company/manguide', { manguide: manguide });
  });
};

exports.womanguide = function (req, res, next) {
  Company.findOne({title: "womanguide"}, function(err, womanguide){
    if (err) {
      return next(err);
    }
    res.render('company/womanguide', { womanguide: womanguide });
  });
};

exports.sizedesc = function (req, res, next) {
  Company.findOne({title: "sizedesc"}, function(err, sizedesc){
    if (err) {
      return next(err);
    }
    res.render('company/sizedesc', { sizedesc: sizedesc });
  });
};

// 后台
exports.companyindex = function (req, res, next) {
  console.log("companyindex");
  Company.find({}, function(err, companies){
    if (err) {
      return next(err);
    }

    res.send(companies);
  });
};

exports.companyshow = function (req, res, next) {
  console.log("companyshow:", req.params.name);
  Company.findOne({title: req.params.name}, function(err, company){
    if (err) {
      return next(err);
    }

    res.send(company);
  });
};

exports.companyupdate = function (req, res, next) {
  console.log("companyupdate:", req.params.name);
  Company.findOne({title: req.params.name}, function (err, company){
    company.content = req.body.content;
    company.save(function(err){
      if (err) {
        console.log(err.err);
        return next(err);
      };
      res.send({result: 'success'});
    });
  });
};
