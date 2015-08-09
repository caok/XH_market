var models = require('../models');
var Category = models.Category;
var Product = models.Product;

exports.index = function (req, res, next) {
  Category.find({}).limit(6).exec(function(err, categories){
    if (err) {
      return next(err);
    };
    var mostCates = [];
    if (categories){
      searchPdsByCategory(0, categories, mostCates, res);
    }
  });
};

function searchPdsByCategory(idx, categories, mostCates, res){
  if (idx >= 3){
    return res.render('index', { categories: categories, mostCates:mostCates });
  };
  var cate = categories[idx];
  Product.find({categoryId: cate._id}).select("_id name images coverIndex categoryId").limit(10).exec(function(err, pds){
    var obj = {id: cate._id, name: cate.name, enName: cate.enName, pds: pds};
    mostCates.push(obj);
    process.nextTick(function(){
      searchPdsByCategory(idx+1, categories, mostCates, res);
    });
  });
};
