var models = require('../models');
var Category = models.Category;
var Product = models.Product;

// ----------------- 前台 --------------
exports.search = function (req, res, next) {
  if (req.body.lang == 'en'){
    Product.find({ 'name.en': new RegExp(req.body.search)}, function(err, products){
      if (err) {
        return next(err);
      }
      res.render('product/search', { products: products });
    });
  } else {
    Product.find({ 'name.zh': new RegExp(req.body.search)}, function(err, products){
      if (err) {
        return next(err);
      }
      res.render('product/search', { products: products });
    });
  }
};

exports.showCategories = function (req, res, next) {
  Category.find({}, function(err, categories){
    if (err) {
      return next(err);
    }
    res.render('product/categories', { categories: categories, title: '产品分类清单' });
  });
};

exports.showCategory = function (req, res, next) {
  Category.findOne({_id: req.params.id}, function(err, category){
    if (err) {
      return next(err);
    };
    if (category){
      Product.find({categoryId: category._id}).select("_id name price images coverIndex categoryId state quantity").exec(function(error, products){
        if (error) {
          return next(error);
        };

        Category.find({}, function(err, categories){
          res.render('product/index', { category: category, categories: categories, products: products, title: '产品清单' });
        });
      });
    };
  });
};

exports.showProduct = function (req, res, next) {
  Product.findOne({_id: req.params.id}, function(err, product){
    if (err) {
      return next(err);
    };
    if (product){
      Category.findOne({_id: product.categoryId}, function(error, category){
        if (error) {
          return next(error);
        };
        res.render('product/show', { category: category, product: product, title: '产品详情' });
      });
    };
  });
};

exports.getProductDetail = function (req, res, next) {
  Product.findOne({_id: req.params.id}, function(err, product){
    if (err) {
      return next(err);
    };
    if (product){
      res.send({result: "success", product: product});
    };
  });
};

// ----------------- 后台管理 ---------------
// for category
exports.categoryindex = function (req, res, next) {
  console.log("category index");
  Category.find({}, function(err, categories){
    if (err) {
      return next(err);
    }

    res.send(categories);
  });
};

exports.categoryshow = function (req, res, next) {
  Category.findOne({_id: req.params.id}, function(err, category){
    if (err) {
      return next(err);
    }

    res.send(category);
  });
};

exports.categorycreate = function (req, res, next) {
  Category.find({name: req.body.name}, function(err, categories){
    if (err) {
      return next(err);
    };
    if (categories.length > 0){
      res.send({result: 'failure', message: '该产品类别名已经被使用!'})
      return;
    };

    var category = new Category();
    category.name = req.body.name;
    category.enName = req.body.enName;
    category.imgUrl = req.body.imgUrl;
    category.save(function(err){
      if (err) {
        return next(err);
      };
      res.send({result: 'success'});
    });
  });
};

exports.categoryupdate = function (req, res, next) {
  Category.findOne({_id: req.params.id}, function (err, category){
    category.name = req.body.name;
    category.enName = req.body.enName;
    category.imgUrl = req.body.imgUrl;
    category.save(function(err){
      if (err) {
        console.log(err.err);
        return res.send({result: 'failure', message: '该产品类别名已经被使用!'});
        //return next(err);
      };
      res.send({result: 'success'});
    });
  });
};

exports.categorydestroy = function (req, res, next) {
  console.log("category destroy: ", req.params.id);
  Category.remove({_id: req.params.id}, function (err) {
    if (err) return next(err);
  });
};

// for product
exports.index = function (req, res, next) {
  console.log("product index");
  Product.find({categoryId: req.params.cid}).select("name price quantity categoryId state selled").exec(function(err, products){
    if (err) {
      return next(err);
    }

    res.send(products);
  });
};

exports.show = function (req, res, next) {
  console.log("product show");
  Product.findOne({_id: req.params.id, categoryId: req.params.cid}, function(err, product){
    if (err) {
      return next(err);
    };
    res.send(product);
  });
};

exports.create = function (req, res, next) {
  console.log("product create");
  product = new Product();
  product.name = req.body.name;
  product.price = req.body.price;
  product.quantity = req.body.quantity;
  product.images = req.body.images;
  product.coverIndex = req.body.coverIndex;
  product.categoryId = req.body.categoryId;
  product.description = req.body.description;
  product.intro = req.body.intro;
  product.state = req.body.state;
  product.save(function(err){
    if (err) {
      return res.send({result: 'failure', message: '出现了某些错误!'});
    };
    res.send({result: 'success'});
  });
};

exports.update = function (req, res, next) {
  console.log("product update");
  Product.findOne({_id: req.params.id, categoryId: req.params.cid}, function (err, product){
    product.name = req.body.name;
    product.price = req.body.price;
    product.quantity = req.body.quantity;
    product.images = req.body.images;
    product.coverIndex = req.body.coverIndex;
    product.description = req.body.description;
    product.intro = req.body.intro;
    product.state = req.body.state;
    product.save(function(err){
      if (err) {
        return res.send({result: 'failure', message: '出现了某些错误!'});
        //return next(err);
      };
      res.send({result: 'success'});
    });
  });
};

exports.destroy = function (req, res, next) {
  console.log("product destroy");
  Product.remove({_id: req.params.id, categoryId:req.params.cid}, function(err){
    if (err) return next(err);
  });
};
