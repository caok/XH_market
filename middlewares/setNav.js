var models = require('../models');
var Category = models.Category;
var Company = models.Company;
var Vcategory = models.Vcategory;

exports.setNav = function (req, res, next) {
  Category.find({}, function(err, cates){
    if (err) {
      return next(err);
    };
    res.locals.cates = cates;

    Vcategory.find({}, function(err, vcates){
      if (err) {
        return next(err);
      };
      res.locals.vcates = vcates;
      next();
    });
  });
};

exports.setBasicinfo = function (req, res, next) {
  Company.findOne({title: "basicinfo"}, function(err, basicinfo){
    if (err) {
      return next(err);
    };
    res.locals.basicinfo = basicinfo.content;
    next();
  });
};
