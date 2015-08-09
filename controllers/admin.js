var md5 = require('../lib').md5;
var models = require('../models');
var Admin = models.Admin;

exports.index = function (req, res, next) {
  res.render('admin/index');
};

exports.showLogin = function (req, res, next) {
  if(req.params.new === 'true'){
    if(req.session.admin)
      delete req.session.admin;
  }
  if(req.session.admin)
    return res.redirect('/admin');

  res.render('admin/login');
};

exports.login = function (req, res, next) {
  var admin = req.body.name.trim();
  var password = req.body.password.trim();
  if (!admin || !password) {
    return res.send([false, "用户名/密码 不允许为空!"]);
  }

  Admin.findOne({name: admin}, function (err, user) {
    if (err) {
      return next(err);
    };

    if (!user) {
      return res.send([false, "该用户不存在!"])
    };
    if (md5(password) !== user.password) {
      return res.send([false, "密码不正确!"])
    } else {
      req.session.admin = admin;
      res.send([true]);
    };
  });

  return;
};

// ------------------ 管理员管理 ----------------
exports.showAdmins = function (req, res, next) {
  console.log("admin list");
  Admin.find({}, function(err, admins){
    if (err) {
      return next(err);
    };
    res.send(admins);
  });
};

exports.showAdmin = function (req, res, next) {
  console.log("admin show");
  Admin.findOne({_id: req.params.id}, function(err, admin){
    if (err) {
      return next(err);
    };
    res.send(admin);
  });
};

exports.createAdmin = function (req, res, next) {
  console.log("admin create");
  Admin.find({name: req.body.name}, function(err, admins){
    if (err) {
      return next(err);
    };
    if (admins.length > 0){
      res.send({result: 'failure', message: '该用户名已经被使用!'})
      return;
    };

    var admin = new Admin();
    admin.name = req.body.name;
    admin.password = md5(req.body.password.trim());
    admin.save(function(err){
      if (err) {
        return next(err);
      };
      res.send({result: 'success'});
    });
  });
};

exports.updateAdmin = function (req, res, next) {
  console.log("admin update");
  Admin.findOne({_id: req.params.id}, function (err, admin){
    admin.password = md5(req.body.password.trim());
    admin.save(function(err){
      if (err) {
        return next(err);
      };
      res.send({result: 'success'});
    });
  });
};

exports.destoryAdmin = function (req, res, next) {
  console.log("admin destroy");
  Admin.remove({_id: req.params.id}, function (err) {
    if (err) return next(err);
  });
};

// ------------------ 其他 ----------------------
exports.getPartials = function (req, res, next) {
  res.render('admin/partials/'+req.params.name);
};

exports.upload = function (req, res, next) {
  if(!req.files.files){
    res.send(false);
    return;
  }
  var fileInfo = req.files.files;
  var file = {name: fileInfo.originalname, path: fileInfo.path.replace("public", "")}
  res.send(JSON.stringify({file: file}));
};

exports.editorGetImg = function (req, res, next) {
  res.send("updateSavePath("+JSON.stringify(['upload'])+");");
};

exports.editorUploadImg = function (req, res, next) {
  if(!req.files.upfile){
    res.send(JSON.stringify({"state":"\u975e\u6cd5\u4e0a\u4f20\u76ee\u5f55"}));
    return;
  };

  var file = req.files.upfile;
  res.send(JSON.stringify({'url':file.path.replace("public", ""),
                           'title':file.originalname,
                           'original':file.name,
                           'state':'SUCCESS'}));
};
