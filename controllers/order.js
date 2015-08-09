var models = require('../models');
var User = models.User;
var Order = models.Order;
var Product = models.Product;
var Company = models.Company;

exports.showMyCart = function (req, res, next) {
  User.findOne({name: req.session.user}, function (err, user) {
    if (err) {
      return next(err);
    };
    var pids = [];
    for (var i=0; i<user.cart.length; i++){
      pids.push(user.cart[i].productId);
    };
    Product.find({}).where('_id').in(pids).select("_id name price images coverIndex state quantity").exec(function(error, pds){
      if (error){
        return next(error);
      };
      var totalprice = 0;
      for (var j=0; j<pds.length; j++){
        for (var k=0; k<user.cart.length; k++){
          if (String(pds[j]._id) === String(user.cart[k].productId)){
            pds[j].buyQuantity = user.cart[k].quantity;
            totalprice += pds[j].buyQuantity * pds[j].price;
          };
        };
      };
      res.render('order/mycart', {pds: pds, totalprice: totalprice.toFixed(2)});
    });
  });
};

exports.addToCart = function (req, res, next) {
  if (!req.session.user){
    return res.send({result: 'login'})
  };
  User.findOne({name: req.session.user}, function (err, user) {
    if (err) {
      return res.send({result: 'failure'});
    };
    if (user) {
      var existence = false;
      for (var i=0; i<user.cart.length; i++){
        if (user.cart[i].productId == req.body.productId){
          user.cart[i].quantity = parseInt(user.cart[i].quantity) + parseInt(req.body.quantity);
          existence = true;
          break;
        };
      };
      if (!existence){
        var item = {quantity: req.body.quantity,
                    productId: req.body.productId};
        user.cart.push(item);
      };
      user.save(function(error){
        if (err) {
          return res.send({result: 'failure'});
        };
        res.send({result: 'success', cartnum: user.cart.length});
      });
    };
  });
};

exports.getPdFromCart = function (req, res, next) {
  User.findOne({name: req.session.user}, function (err, user) {
    if (err) {
      return next(err);
    };
    Product.findOne({_id: req.params.id}).select("_id name price images coverIndex state quantity").exec(function(error, pd){
      if (error){
        return next(error);
      };
      if (pd) {
        for (var k=0; k<user.cart.length; k++){
          if (String(pd._id) === String(user.cart[k].productId)){
            pd.buyQuantity = user.cart[k].quantity;
          };
        };
        res.render('order/mycart', {result: 'success', pd: pd});
      } else {
        res.render('order/mycart', {result: 'failure'});
      };
    });
  });
};

exports.updatePdQuantity = function (req, res, next) {
  User.findOne({name: req.session.user}, function (err, user) {
    if (err) {
      return next(err);
    };
    for (var k=0; k<user.cart.length; k++){
      if (String(req.body.productId) === String(user.cart[k].productId)){
        user.cart[k].quantity = req.body.quantity;
      };
    };
    user.save(function(error){
      if (err) {
        return res.send({result: 'failure'});
      };
      res.send({result: 'success', quantity: req.body.quantity, productId: req.body.productId});
    });
  });
};

exports.removeFromCart = function (req, res, next) {
  User.findOne({name: req.session.user}, function (err, user) {
    if (err) {
      return next(err);
    };
    for (var k=0; k<user.cart.length; k++){
      if (String(req.params.id) === String(user.cart[k].productId)){
        user.cart.splice(k, 1);
      };
    };
    user.save(function(error){
      if (err) {
        return res.send({result: 'failure'});
      };
      //res.send({result: 'success'});
      res.redirect('/mycart');
    });
  });
};

exports.placeOrder = function (req, res, next) {
  console.log("placeOrder-------", req.body.quantity);
  console.log("id-------", req.body.id);
  res.redirect('/myorder?id='+req.body.id+"&quantity="+req.body.quantity);
};

exports.showMyOrder = function (req, res, next) {
  console.log("show my order:-----");
  console.log("id: ", req.query.id);
  console.log("quantity: ", req.query.quantity);
  if (req.query.id && req.query.quantity && (req.query.quantity>0)){
    Product.findOne({_id: req.query.id}).select("_id name price images coverIndex state quantity").exec(function(err, pd){
      if (err){
        return next(err);
      };
      if (pd){
        pd.buyQuantity = req.query.quantity;
        var totalprice = req.query.quantity * pd.price;
        Company.findOne({title: "basicinfo"}, function(err, basicinfo){
          var freight = basicinfo.content.freight || 0;
          if (parseFloat(totalprice) >= parseFloat(basicinfo.content.freeCondition)){
            freight = 0;
          };
          totalprice = parseFloat(totalprice) + parseFloat(freight);
          User.findOne({name:req.session.user}, function (err, user) {
            if (err) {
              return next(err);
            };
            res.render('order/myorder', {pds: [pd], totalprice: totalprice.toFixed(2), user: user, productId: req.query.id, buyQuantity: req.query.quantity, freight: freight});
          });
        });
      };
    });
  } else {
    User.findOne({name: req.session.user}, function (err, user) {
      if (err) {
        return next(err);
      };
      var pids = [];
      for (var i=0; i<user.cart.length; i++){
        pids.push(user.cart[i].productId);
      };
      Product.find({}).where('_id').in(pids).select("_id name price images coverIndex state quantity").exec(function(error, pds){
        if (error){
          return next(error);
        };
        var totalprice = 0;
        for (var j=0; j<pds.length; j++){
          for (var k=0; k<user.cart.length; k++){
            if (String(pds[j]._id) === String(user.cart[k].productId)){
              pds[j].buyQuantity = user.cart[k].quantity;
              totalprice += pds[j].buyQuantity * pds[j].price;
            };
          };
        };
        Company.findOne({title: "basicinfo"}, function(err, basicinfo){
          var freight = basicinfo.content.freight || 0;
          if (parseFloat(totalprice) >= parseFloat(basicinfo.content.freeCondition)){
            freight = 0;
          };
          totalprice = parseFloat(totalprice) + parseFloat(freight);
          res.render('order/myorder', {pds: pds, totalprice: totalprice.toFixed(2), user: user, productId:"", buyQuantity: "", freight: freight});
        });
      });
    });
  };
};

// 生成订单
exports.submitOrder = function (req, res, next) {
  console.log("productId: ", req.query.productId);
  console.log("quantity: ", req.query.quantity);
  if (req.query.productId && req.query.quantity){
    Product.findOne({_id: req.query.productId}).select("_id name images coverIndex price state quantity").exec(function(err, pd){
      if (err){
        return next(err);
      };
      // state 0:可购买  
      if (pd && pd.state == 0 && pd.quantity>=req.query.quantity){
        User.findOne({name:req.session.user}, function (err, user) {
          if (err) {
            return next(err);
          };

          var address = {};
          for (var i=0; i<user.addresses.length; i++) {
            if (String(user.addresses[i]._id) == user.curAddress) {
              address = user.addresses[i];
            };
          };
          if (user && address){
            var order = new Order();
            order.userId = user._id;
            order.userName = user.name;
            order.products = [{productId: pd._id, price: pd.price, quantity: req.query.quantity, coverUrl:pd.images[pd.coverIndex], name:pd.name}];
            Company.findOne({title: "basicinfo"}, function(err, basicinfo){
              totalprice = pd.price * req.query.quantity;
              var freight = basicinfo.content.freight || 0;
              if (parseFloat(totalprice) >= parseFloat(basicinfo.content.freeCondition)){
                freight = 0;
              };
              totalprice = parseFloat(totalprice) + parseFloat(freight);
              order.freight = freight;
              order.pay = totalprice.toFixed(2);
              order.happenedAt = new Date().getTime();
              order.address = address;
              order.state = 0;
              order.save(function(error, o){
                if (error){
                  return res.render('notify/notify', {error: '生成订单发生异常!'});
                };
                if (o){
                  return res.redirect('/chosepayment/'+o._id)
                }
              });
            });
          } else {
            return res.render('notify/notify', {error: '未选择购买地址,请重新下单!'});
          };
        });
      } else {
        return res.render('notify/notify', {error: '该物品不能购买,请选择其他产品!'});
      };
    });
  } else {
    User.findOne({name: req.session.user}, function (err, user) {
      if (err) {
        return next(err);
      };

      var address = {};
      for (var i=0; i<user.addresses.length; i++) {
        if (String(user.addresses[i]._id) == user.curAddress) {
          address = user.addresses[i];
        };
      };
      var pids = [];
      for (var i=0; i<user.cart.length; i++){
        pids.push(user.cart[i].productId);
      };
      Product.find({}).where('_id').in(pids).select("_id name images coverIndex price state quantity").exec(function(error, pds){
        if (error){
          return next(error);
        };
        var totalprice = 0;
        var products = [];
        for (var j=0; j<pds.length; j++){
          for (var k=0; k<user.cart.length; k++){
            if (String(pds[j]._id) === String(user.cart[k].productId)){
              if (pds[j].state != 0 && pds[j].quantity < user.cart[k].quantity){
                return res.render('notify/notify', {error: '该物品不能购买,请选择其他产品!'});
              };
              var pd = {productId:pds[j]._id, quantity:user.cart[k].quantity, price:pds[j].price, coverUrl:pds[j].images[pds[j].coverIndex], name:pds[j].name};
              products.push(pd);
              totalprice += user.cart[k].quantity * pds[j].price;
            };
          };
        };

        if (user && address){
          var order = new Order();
          order.userId = user._id;
          order.userName = user.name;
          order.products = products;
          Company.findOne({title: "basicinfo"}, function(err, basicinfo){
            var freight = basicinfo.content.freight || 0;
            if (parseFloat(totalprice) >= parseFloat(basicinfo.content.freeCondition)){
              freight = 0;
            };
            console.log("before: ", totalprice.toFixed(2));
            totalprice = parseFloat(totalprice) + parseFloat(freight);
            console.log("totalprice: ", totalprice);
            order.freight = freight;
            order.pay = totalprice.toFixed(2);
            order.happenedAt = new Date().getTime();
            order.address = address;
            order.state = 0;
            order.save(function(error, o){
              if (error){
                console.log("order save:", error);
                return res.render('notify/notify', {error: '生成订单发生异常!'});
              };
              if (o){
                user.cart = [];
                user.save(function(error){
                  if (error){
                    console.log("user save: ", error);
                    return res.render('notify/notify', {error: '生成订单发生异常!'});
                  };
                  return res.redirect('/chosepayment/'+o._id);
                });
              };
            });
          });
        } else {
          return res.render('notify/notify', {error: '未选择购买地址,请重新下单!'});
        };
      });
    });
  };
};

exports.showChosePayment = function (req, res, next) {
  Order.findOne({_id: req.params.id}, function(err, order){
    if (err) {
      return next(err);
    };

    res.render('order/chosepayment', {order: order});
  });
};

//exports.payment = function (req, res, next) {
  //Order.findOne({_id: req.params.id}, function(err, order){
    //if (err) {
      //return next(err);
    //};
    //if (order){
      //if (req.body.payment == "alipay"){
        //searchAndUpdatePds(0, order.products, order, true, res);
      //};
    //};
  //});
//};

//// flag
//// true:正常情况(product减少)
//// false: 回退(product增加回原先数量)
//function searchAndUpdatePds(idx, pds, order, flag, res){
  //var pd = pds[idx];
  //if (flag){
    //Product.findOneAndUpdate({_id: pd.productId, quantity:{$gte:pd.quantity}, state:0}, {$inc:{selled:pd.quantity, quantity:-pd.quantity}}, function(error, product){
      //if (product){
        //console.log("findOneAndUpdate-----", product.quantity);

        //if (idx == pds.length - 1){
          //order.state = 1;
          //order.paymentTime = new Date().getTime();
          //order.save(function(err){
            //if(err){
              //return res.render('notify/notify', {error: '支付失败!'});
            //};
            //return res.render('notify/notify', {success: '付款成功!'});
          //});
        //} else {
          //process.nextTick(function(){
            //searchAndUpdatePds(idx+1, pds, order, true, res);
          //});
        //};
      //} else {
        //// 回退
        //process.nextTick(function(){
          //searchAndUpdatePds(idx-1, pds, order, false, res);
        //});
      //};
    //});
  //} else {
    //Product.findOneAndUpdate({_id: pd.productId}, {$inc:{selled:-pd.quantity, quantity:pd.quantity}}, function(error, product){
      //if (product){
        //if (idx == 0){
          //return res.render('notify/notify', {error: '支付失败,该物品不能购买,请选择其他产品!'});
        //} else {
          //process.nextTick(function(){
            //searchAndUpdatePds(idx-1, pds, order, false, res);
          //});
        //};
      //} else {
        //process.nextTick(function(){
          //searchAndUpdatePds(idx-1, pds, order, false, res);
        //});
      //};
    //});
  //}
//};

//exports.cancelOrder = function (req, res, next) {
  //Order.findOne({_id: req.params.id}, function(err, order){
    //if (err) {
      //return next(err);
    //};

    //// 关闭订单
    //order.state = 7;
    //order.save(function(error){
      //if (error) {
        //return next(error);
      //};

      //res.redirect('/orders');
    //});
  //});
//};

exports.cancelOrderByReason = function (req, res, next) {
  Order.findOne({_id: req.params.id}, function(err, order){
    if (err) {
      return next(err);
    };

    // 关闭订单
    order.state = 7;
    order.closeReason = req.body.closeReason ? req.body.closeReason : "客户未填取消订单原因";
    order.save(function(error, order){
      if (error) {
        return next(error);
      };

      res.send({result: "success"});
    });
  });
};

//确认收货
exports.submitReceived = function (req, res, next) {
  Order.findOne({_id: req.params.id}, function(err, order){
    if (err) {
      return next(err);
    };

    // 已收货,未评价
    order.state = 3;
    order.receivedTime = new Date().getTime();
    order.save(function(error){
      if (error) {
        return next(error);
      };

      res.redirect('/evaluation/'+req.params.id);
    });
  });
};

// 后台管理部分
exports.getorders = function (req, res, next) {
  console.log("页码: ", req.query.page);
  var current_page = req.query.page || 1;
  var pernums = 2;
  Order.paginate({state: {"$in":[1,2,3,4,5,6,7]}}, current_page, pernums, function(error, pageCount, orders, itemCount) {
    if (error) {
      return next(error);
    } else {
      res.send(orders);
    }
  }, {sortBy: {paymentTime: -1, happenedAt: -1}});
};

exports.searchorders = function (req, res, next){
  console.log("页码: ", req.query.page);
  console.log("state: ", req.query.state);
  // 页码
  var current_page = req.query.page || 1;
  var pernums = 20;
  var state = req.query.state || "all";
  if (state == "all"){
    Order.paginate({state: {"$in":[1,2,3,4,5,6,7]}}, current_page, pernums, function(error, pageCount, orders, itemCount) {
      if (error) {
        return next(error);
      } else {
        console.log("数量:", orders.length);
        res.send({orders: orders, pages: pageCount, page: current_page});
      }
    }, {sortBy: {paymentTime: -1, happenedAt: -1}});
  } else {
    Order.paginate({state: state}, current_page, pernums, function(error, pageCount, orders, itemCount) {
      if (error) {
        return next(error);
      } else {
        console.log("数量:", orders.length);
        res.send({orders: orders, pages: pageCount, page: current_page});
      }
    }, {sortBy: {paymentTime: -1, happenedAt: -1}});
  };
};

exports.getorder = function (req, res, next) {
  Order.findOne({_id: req.params.id}, function(err, order){
    if (err) {
      return next(err);
    }
    res.send(order);
  });
};

exports.updateorder = function (req, res, next) {
  Order.findOne({_id: req.params.id}, function(err, order){
    if (err) {
      return next(err);
    }
    order.state = req.body.state;
    order.closeReason = req.body.closeReason;
    if (req.body.logisticsInfo){
      order.logisticsInfo = req.body.logisticsInfo;
      order.deliveryTime = new Date().getTime();
    }
    order.save(function(err){
      if (err) {
        return res.send({result: 'failure', message: '出现了某些错误!'});
      };
      res.send({result: 'success'});
    });
  });
};
