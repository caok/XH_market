var models = require('../models');
var User = models.User;

exports.auth_user = function (req, res, next) {
  if (req.cookies.user && req.cookies.rememberKey){
    User.findOne({name: req.cookies.user}, function (err, user){
      if (user.rememberKey == req.cookies.rememberKey) {
        res.locals.current_user = user.name;
        res.locals.cartnum = user.cart.length;
        req.session.user = user.name;
      };
    });
  } else {
    //res.locals.current_user = req.session.user ? req.session.user : null;
    if (req.session.user) {
      User.findOne({name: req.session.user}, function (err, user){
        if (err) {
          return next(err);
        };
        res.locals.current_user = user.name;
        res.locals.cartnum = user.cart.length;
      });
    } else {
      res.locals.current_user = null
      res.locals.cartnum = 0;
    };
  };
  next();
};

exports.userRequired = function (req, res, next) {
  if (!req.session || !req.session.user) {
    //return res.send(403, 'forbidden!');
    return res.redirect('/login');
  }
  next();
};

exports.adminRequired = function (req, res, next) {
  if (!req.session.admin){
    return res.redirect('/admin/login');
  //} else {
    //res.locals.admin = req.session.admin;
  };
  next();
};
