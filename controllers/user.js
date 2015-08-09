var md5 = require('../lib').md5;
var models = require('../models');
var User = models.User;
var Order = models.Order;
var Product = models.Product;

exports.showInfo = function (req, res, next) {
  User.findOne({name: req.session.user}).select("_id name email point curAddress addresses").exec(function(err, user){
    if (err) {
      return next(err);
    };
    if (user){
      res.render('user/show', { user: user });
    };
  });
};

exports.showChangePass = function (req, res, next) {
  res.render('user/changepass');
}

exports.updateInfo = function (req, res, next) {
  var name = req.body.name.trim();
  var curpass = req.body.curpass;
  var pass = req.body.pass;
  var repass = req.body.repass;
  if (pass !== repass) {
    return res.render('user/changepass', {error: "新密码和确认密码不一致。"});
  };

  if (pass.length < 6) {
    return res.render('user/changepass', {error: "密码长度过短，必须大于等于6位。"});
  }

  User.findOne({name: name}, function(err, user){
    if (err) {
      return next(err);
    };
    curpass = md5(curpass);
    if (curpass !== user.password) {
      return res.render('user/changepass', {error: "当前密码错误。"});
    } else {
      user.password = md5(pass);
      user.save(function (err) {
        if (err) {
          return next(err);
        }
        res.render('user/show');
      });
    };
  })
};

exports.updateAddress = function (req, res, next) {
  console.log("updateAddress-----");
  var address = { id: req.body.id,
                  receiver: req.body.receiver,
                  street: req.body.street,
                  tel: req.body.tel,
                  postcode: req.body.postcode};
  User.findOne({name: req.session.user}, function (err, user) {
    if (err) {
      //return next(err);
      return res.send({result: 'failure'});
    };

    if (req.body.id){
      // update
      for (var i=0; i<user.addresses.length; i++) {
        if (user.addresses[i]._id == address.id) {
          user.addresses[i].receiver = address.receiver;
          user.addresses[i].street = address.street;
          user.addresses[i].tel = address.tel;
          user.addresses[i].postcode = address.postcode;
        };
      };
    } else {
      // create
      if (!user.addresses){
        user.addresses=[];
      }
      user.addresses.push(address);
    };
    user.save(function(error, u){
      if (error) {
        return res.send({result: 'failure'});
      };
      console.log(u);
      if (!req.body.id){
        address.id = u.addresses[u.addresses.length-1]._id;
      }
      return res.send({result: 'success', address: address, fresh: !!req.body.id});
    });
  });
};

exports.destroyAddress = function (req, res, next) {
  console.log("destroy address----");
  User.findOne({name: req.session.user}, function (err, user) {
    if (err) {
      return next(err);
    };

    for (var i=0; i<user.addresses.length; i++) {
      if (user.addresses[i]._id == req.params.id) {
        user.addresses.splice(i, 1);
        if (user.addresses.length > 0){
          user.curAddress = user.addresses[0]._id || "";
        } else {
          user.curAddress = "";
        }
      };
    };
    user.save(function(error){
      if (error) {
        return res.send({result: 'failure'});
      };
      return res.send({result: 'success'});
    });
  });
};

exports.setDefaultAddress = function (req, res, next) {
  console.log("set default address-----");
  var address = {};
  User.findOne({name: req.session.user}, function (err, user) {
    if (err) {
      return next(err);
    };

    for (var i=0; i<user.addresses.length; i++) {
      if (String(user.addresses[i]._id) == req.params.id) {
        user.curAddress = req.params.id;
        address = user.addresses[i];
      };
    };
    user.save(function(error){
      if (error) {
        return res.send({result: 'failure'});
      };
      return res.send({result: 'success', address: address});
    });
  });
};

exports.showMyOrders = function (req, res, next) {
  console.log("页码: ", req.query.page);
  var current_page = req.query.page || 1;
  var pernums = 5;
  Order.paginate({userName: req.session.user}, current_page, pernums, function(error, pageCount, orders, itemCount) {
    if (error) {
      return next(error);
    } else {
      res.render('user/orders', {orders: orders, pages: pageCount, current_page: current_page});
    }
  }, {sortBy: {_id: -1}});
};

// 待付款
exports.showMyPayment = function (req, res, next) {
  Order.find({userName: req.session.user, state: 0}, function (err, orders){
    if (err) {
      return next(err);
    };
    res.render('user/payment', {orders: orders});
  });
};

// 待收货
exports.showMyReceiving = function (req, res, next) {
  Order.find({userName: req.session.user}).where('state').in([1,2]).exec(function (err, orders){
    if (err) {
      return next(err);
    };
    res.render('user/receiving', {orders: orders});
  });
};

// 待评价
exports.showMyEvaluation = function (req, res, next) {
  Order.find({userName: req.session.user, state: 3}, function (err, orders){
    if (err) {
      return next(err);
    };
    res.render('user/evaluation', {orders: orders});
  });
};

// 评价
exports.createReview = function (req, res, next) {
  Product.findOne({_id: req.params.id}, function(err, pd){
    if (err) {
      return next(err);
    };
    var comment = {
      userName: req.session.user,
      orderId: req.body.orderId,
      title: req.body.title,
      content: req.body.content,
      usabilityPoint: req.body.usabilityPoint,
      effectivePoint: req.body.effectivePoint,
      quantityPoint: req.body.quantityPoint,
      attitudePoint: req.body.attitudePoint,
      happenedAt: new Date().getTime()
    }
    pd.comments.push(comment);
    pd.save(function(err){
      if (err){
        res.send({result: 'failure'})
      }
      Order.findOne({_id: req.body.orderId}, function (err, order){
        if (err){
          res.send({result: 'failure'})
        }
        if (order){
          // 已评价
          order.state = 4;
          order.save(function(err){
            if (err){
              res.send({result: 'failure'})
            }
            res.send({result: 'success', usabilityPoint: req.body.usabilityPoint, effectivePoint: req.body.effectivePoint, quantityPoint: req.body.quantityPoint, attitudePoint: req.body.attitudePoint})
          })
        }
      })
    });
  });
};

// 评价页面
exports.showReview = function (req, res, next) {
  Order.findOne({_id: req.params.id}, function(err, order){
    if (err) {
      return next(err);
    };
    res.render('user/review', {order: order})
  });
};

// 查看物流
exports.showLogistics = function (req, res, next) {
  Order.findOne({_id: req.params.id}, function(err, order){
    if (err) {
      return next(err);
    };
    res.render('user/logistics', {order: order})
  });
};

// 查看退货
exports.showReturns = function (req, res, next) {
  Order.find({userName: req.session.user}).where('state').in([5,6]).exec(function (err, orders){
    if (err) {
      return next(err);
    };
    res.render('user/returns', {orders: orders});
  });
};

exports.showReturnDetail = function (req, res, next) {
  Order.findOne({_id: req.params.id}, function(err, order){
    if (err) {
      return next(err);
    };
    res.render('user/return', {order: order});
  });
};

exports.updateReturnDetail = function (req, res, next) {
  console.log("退货", req.params.id);
  console.log(req.body.returnReason);
  Order.findOne({_id: req.params.id}, function(err, order){
    if (err) {
      return next(err);
    };

    if (order){
      order.state = 5;
      order.returnReason = req.body.returnReason;
      order.save(function(error){
        if (error){
          return res.redirect('/returns/'+req.params._id, {error: "退货失败!"});
        };
        return res.redirect('/returns');
      })
    } else {
      return res.redirect('/returns/'+req.params._id, {error: "退货失败!"});
    };
  });
};
