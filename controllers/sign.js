var validator = require('validator');
var md5 = require('../lib').md5;
var randomString = require('../lib').randomString;
var config = require('../config');
var mail = require('../services/mail');
var models = require('../models');
var User = models.User;

exports.showSignup = function (req, res, next) {
  res.render('sign/signup', { title: '注册' });
};

exports.signup = function (req, res, next) {
  var name = req.body.name.trim();
  var email = req.body.email.trim();
  var password = req.body.password.trim();
  var password_confirmation = req.body.password_confirmation.trim();

  if (name === '' || password === '' || password_confirmation === '' || email === '') {
    res.render('sign/signup', {error: '信息不完整。', name: name, email: email});
    return;
  }

  if (name.length < 2) {
    res.render('sign/signup', {error: '用户名至少需要2个字符。', name: name, email: email});
    return;
  }

  if (!validator.isAlphanumeric(name)) {
    res.render('sign/signup', {error: '用户名只能使用0-9，a-z，A-Z。', name: name, email: email});
    return;
  }

  if (!validator.isEmail(email)) {
    res.render('sign/signup', {error: '不正确的电子邮箱。', name: name, email: email});
    return;
  }

  if (password.length < 6) {
    res.render('sign/signup', {error: '密码长度过短，必须大于等于6位。', name: name, email: email});
    return;
  }

  if (password !== password_confirmation) {
    res.render('sign/signup', {error: '两次密码输入不一致。', name: name, email: email});
    return;
  }

  User.find({'$or': [{name: name}, {email: email}]}, null, {}, function(err, users) {
    if (err) {
      return next(err);
    }
    if (users.length > 0) {
      res.render('sign/signup', {error: '用户名或邮箱已被使用。', name: name, email: email});
      return;
    }

    var user = new User();
    user.name = name;
    user.email = email;
    user.password = md5(password);
    user.state = 0;
    user.save(function(err){
      if (err) {
        return next(err);
      }
      // 发送激活邮件
      mail.sendActiveMail(email, md5(email + config.session_secret), name);
      res.render('sign/signup', {success:email});
    });
  });
};

exports.showLogin = function (req, res) {
  res.render('sign/login', { title: '登陆' });
};

exports.login = function (req, res, next) {
  console.log("login remember: ", req.body.remember);
  var loginname = req.body.loginname.trim();
  var password = req.body.password.trim();

  if (!loginname || !password) {
    return res.render('sign/login', { error: '信息不完整。' });
  }

  User.find({'$or': [{name: loginname}, {email: loginname}]}, null, {}, function(err, users) {
    if (err) {
      return next(err);
    }
    if (users.length < 1) {
      return res.render('sign/login', { error: '该用户不存在!' });
    }
    user = users[0];
    password = md5(password);
    if (password !== user.password) {
      return res.render('sign/login', { error: '密码错误!', loginname: loginname });
    }

    if (!user.active) {
      // 重新发送激活邮件
      mail.sendActiveMail(user.email, md5(user.email + config.session_secret), user.name);
      return res.render('sign/login', { error2:user.email});
    }

    if (req.body.remember) {
      var rememberKey = randomString(10);
      user.rememberKey = rememberKey;
      user.save(function(err){
        res.cookie('user', user.name, {expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 7), path: '/'});
        res.cookie('rememberKey', rememberKey, {expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 7), path: '/'});
        req.session.user = user.name;
        res.redirect('/');
      });
    } else {
      req.session.user = user.name;
      res.redirect('/');
    };
  });
};

exports.logout = function (req, res, next) {
  req.session.destroy();
  res.clearCookie('user', { path: '/' });
  res.clearCookie('rememberKey', { path: '/' });
  res.redirect('/');
};

exports.activeAccount = function (req, res, next) {
  var key = req.query.key.trim();
  var name = req.query.name.trim();

  User.findOne({name: name}, function (err, user) {
    if (err) {
      return next(err);
    }

    if (!user || md5(user.email + config.session_secret) !== key) {
      return res.render('notify/notify', {error: '信息有误，帐号无法被激活。'});
    }
    if (user.state.active) {
      return res.render('notify/notify', {error: '帐号已经是激活状态。'});
    }

    user.state = 1;
    user.save(function (err) {
      if (err) {
        return next(err);
      }
      res.render('notify/notify', {success: '帐号已被激活，请登录'});
    });
  });
};

exports.showSearchPass = function (req, res) {
  res.render('sign/search_pass');
};

exports.search_pass_auth = function (req, res) {
  var email = req.body.email.trim();

  if (!validator.isEmail(email)) {
    return res.render('sign/search_pass', {error: '不正确的电子邮箱。'});
  }

  User.findOne({email: email}, function(err, user){
    if (!user) {
      return res.render('sign/search_pass', {error: '没有这个电子邮箱。'});
    }

    var retrieveKey = randomString(15);
    user.retrieveKey = retrieveKey;
    user.retrieveTime = new Date().getTime();
    user.save(function(err) {
      if (err) {
        return next(err);
      }

      mail.sendResetPassMail(email, retrieveKey, user.name);
      res.redirect('/search_pass_auth')
    })
  });
};

exports.showSearchPassAuth = function (req, res) {
  res.render('sign/search_pass_auth');
};

exports.showResetPass = function (req, res) {
  var key = req.query.key;
  var name = req.query.name;
  User.findOne({name: name, retrieveKey: key}, function(err, user){
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render('notify/notify', {error: '信息有误，密码无法重置。'});
    }

    var now = new Date().getTime();
    var oneDay = 1000 * 60 * 60 * 24;
    if (!user.retrieveTime || now - user.retrieveTime > oneDay) {
      return res.render('notify/notify', {error : '该链接已过期，请重新申请。'});
    }
    return res.render('sign/reset_pass', {name : name, key : key});
  });
};

exports.resetPass = function (req, res) {
  var password = req.body.password.trim() || '';
  var password_confirmation = req.body.password_confirmation.trim() || '';
  var key = req.body.key || '';
  var name = req.body.name || '';
  if (password !== password_confirmation) {
    return res.render('sign/reset_pass', {name : name, key : key, error : '两次密码输入不一致。'});
  }

  User.findOne({name: name, retrieveKey: key}, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render('notify/notify', {error : '错误的激活链接'});
    }

    user.password = md5(password);
    user.retrieveKey = null;
    user.retrieveTime = null;
    user.state = 1;
    user.save(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/search_pass_finish')
    });
  });
};

exports.showSearchPassFinish = function (req, res) {
  res.render('sign/search_pass_finish');
};

