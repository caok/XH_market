var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db, function (err) {
  if (err) {
    console.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});

//models
require('./user');
require('./category');
require('./product');
require('./order');
require('./admin');
require('./company');
require('./vcategory');
require('./video');

exports.User      = mongoose.model('User');
exports.Category  = mongoose.model('Category');
exports.Product   = mongoose.model('Product');
exports.Order     = mongoose.model('Order');
exports.Admin     = mongoose.model('Admin');
exports.Company   = mongoose.model('Company');
exports.Vcategory = mongoose.model('Vcategory');
exports.Video     = mongoose.model('Video');
