'use strict';

function MainCtrl($route, $routeParams, $location) {
  //this.$route = $route;
  //this.$routeParams = $routeParams;
  this.$location = $location;
  this.isPath = function(path){
    return($location.path().indexOf(path) > 0);
  }
};

var editor = false;
var editorEn = false;

angular.module('myApp.controllers', [])
  .controller('indexCtrl', ['$scope', '$location', '$routeParams', 'Company', function($scope, $location, $routeParams, Company) {
      Company.get({name: "basicinfo"}, function(basicinfo){
        $scope.basicinfo = basicinfo;
      });
      $scope.uploadFinished = function(e, data, name) {
        $scope.basicinfo.content[name] = data.result.file.path;
      };
      $scope.submit = function(){
        Company.save({name: $scope.basicinfo.title}, $scope.basicinfo, function(res){
          if (res.result === 'failure') {
            $scope.alert = res.message;
          } else if (res.result === 'success') {
            $scope.alert = "更新成功!";
          };
        });
      };
  }])
  .controller('categoryCtrl', ['$scope', '$location', '$routeParams', 'Category', function($scope, $location, $routeParams, Category) {
    if ($routeParams.id) {
      if ($routeParams.id === "new"){
        // 创建新的category
        $scope.category = {name:"", enName:"", imgUrl:""};
        $scope.submit = function(){
          Category.save({}, $scope.category, function(res){
            if (res.result === 'success'){
              $location.path('/category');
            } else if (res.result === 'failure') {
              $scope.alert = res.message;
            }
          });
        };
      } else {
        // 更新category
        Category.get({id: $routeParams.id}, function(category){
          $scope.category = category;
          $scope.submit = function(){
            Category.save({id: $routeParams.id}, $scope.category, function(res){
              if (res.result === 'success'){
                $location.path('/category');
              } else if (res.result === 'failure') {
                $scope.alert = res.message;
              }
            });
          };
        });
      };
      $scope.uploadFinished = function(e, data, name) {
        $scope.category.imgUrl = data.result.file.path;
      };
    } else {
      // category清单
      Category.query(function(categories){
        $scope.categories = categories;
      });
    };

    $scope.rmCategory = function(categoryId){
      var categories = $scope.categories;
      if (!categories){
        return;
      };

      Category.remove({id: categoryId});
      for (var i=0; i<categories.length; i++){
        if (categories[i]._id == categoryId){
          $scope.categories.splice(i, 1);
        }
      };
      $location.path('/category');
    };
  }])
  .controller('productCtrl', ['$scope', '$location', '$routeParams', 'Product', function($scope, $location, $routeParams, Product) {
    if ($routeParams.id) {
      if ($routeParams.id === "new"){
        // 创建新的product
        $scope.product = {
          name: {zh: "", en: ""},
          price: "",
          quantity: "",
          images: [],
          coverIndex: 0,
          description: {zh:"", en:""},
          intro: {zh:"", en:""},
          categoryId: $routeParams.cid,
          state: ""
        };
        $scope.submit = function(){
          Product.save({cid: $routeParams.cid}, $scope.product, function(res){
            if (res.result === 'success'){
              $location.path('/category/'+$routeParams.cid+'/product');
            } else if (res.result === 'failure') {
              $scope.alert = res.message;
            }
          });
        };
      } else {
        // 更新product
        Product.get({cid: $routeParams.cid, id: $routeParams.id}, function(product){
          $scope.product = product;
          $scope.submit = function(){
            Product.save({cid: $routeParams.cid, id: $routeParams.id}, $scope.product, function(res){
              if (res.result === 'success'){
                $location.path('/category/'+$routeParams.cid+'/product');
              } else if (res.result === 'failure') {
                $scope.alert = res.message;
              }
            });
          };
        });
      };

      if (editor){
        UE.getEditor('editor').destroy();
      }
      editor = UE.getEditor('editor');
      if (editor){
        editor.addListener( 'ready', function() {
          editor.setContent($scope.product.description["zh"], true);
          editor.focus();
          editor.addListener('contentChange', function() {
            $scope.$apply(function () {
              $scope.product.description["zh"] = editor.getContent();
              $scope.product.intro["zh"] = editor.getContentTxt().slice(0,130);
            });
          });
        });
      }
      if (editorEn){
        UE.getEditor('editorEn').destroy();
      }
      editorEn = UE.getEditor('editorEn');
      if (editorEn){
        editorEn.addListener( 'ready', function() {
          editorEn.setContent($scope.product.description["en"], true);
          editorEn.addListener('contentChange', function() {
            $scope.$apply(function () {
              $scope.product.description["en"] = editorEn.getContent();
              $scope.product.intro["en"] = editorEn.getContentTxt().slice(0,130);
            });
          });
        });
      }
      $scope.hstip = function(){
        $(".imglist li span#mark").tooltip();
      };
      $scope.uploadFinished = function(e, data, name) {
        $scope.product.images.push(data.result.file.path);
      };
    } else {
      // product清单
      Product.query({cid: $routeParams.cid}, function(products){
        $scope.categoryId = $routeParams.cid;
        $scope.products = products;
      });
    };

    $scope.rmProduct = function(productId, cid){
      var products = $scope.products;
      if (!products){
        return;
      };

      Product.remove({cid: cid,id: productId});
      for (var i=0; i<products.length; i++){
        if (products[i]._id == productId){
          $scope.products.splice(i, 1);
        }
      };
      $location.path('/category/'+cid+'/product');
    };
  }])
  .controller('vcategoryCtrl', ['$scope', '$location', '$routeParams', 'Vcategory', function($scope, $location, $routeParams, Vcategory) {
    if ($routeParams.id) {
      if ($routeParams.id === "new"){
        // 创建新的vcategory
        $scope.vcategory = {name:{zh:"", en:""}};
        $scope.submit = function(){
          Vcategory.save({}, $scope.vcategory, function(res){
            if (res.result === 'success'){
              $location.path('/vcate');
            } else if (res.result === 'failure') {
              $scope.alert = res.message;
            }
          });
        };
      } else {
        // 更新vcategory
        Vcategory.get({id: $routeParams.id}, function(vcategory){
          $scope.vcategory = vcategory;
          $scope.submit = function(){
            Vcategory.save({id: $routeParams.id}, $scope.vcategory, function(res){
              if (res.result === 'success'){
                $location.path('/vcate');
              } else if (res.result === 'failure') {
                $scope.alert = res.message;
              }
            });
          };
        });
      };
    } else {
      // vcategory清单
      Vcategory.query(function(vcategories){
        $scope.vcategories = vcategories;
      });
    };

    $scope.rmVcategory = function(vcategoryId){
      var vcategories = $scope.vcategories;
      if (!vcategories){
        return;
      };

      Vcategory.remove({id: vcategoryId});
      for (var i=0; i<vcategories.length; i++){
        if (vcategories[i]._id == vcategoryId){
          $scope.vcategories.splice(i, 1);
        }
      };
      $location.path('/vcate');
    };
  }])
  .controller('videoCtrl', ['$scope', '$location', '$routeParams', 'Video', function($scope, $location, $routeParams, Video) {
    if ($routeParams.id) {
      if ($routeParams.id === "new"){
        // 创建新的video
        $scope.video = {
          name: {zh: "", en: ""},
          url: "",
          vcategoryId: $routeParams.cid
        };
        $scope.submit = function(){
          Video.save({cid: $routeParams.cid}, $scope.video, function(res){
            if (res.result === 'success'){
              $location.path('/vcate/'+$routeParams.cid+'/video');
            } else if (res.result === 'failure') {
              $scope.alert = res.message;
            }
          });
        };
      } else {
        // 更新video
        Video.get({cid: $routeParams.cid, id: $routeParams.id}, function(video){
          $scope.video = video;
          $scope.submit = function(){
            Video.save({cid: $routeParams.cid, id: $routeParams.id}, $scope.video, function(res){
              if (res.result === 'success'){
                $location.path('/vcate/'+$routeParams.cid+'/video');
              } else if (res.result === 'failure') {
                $scope.alert = res.message;
              }
            });
          };
        });
      };
    } else {
      // video清单
      Video.query({cid: $routeParams.cid}, function(videos){
        $scope.vcategoryId = $routeParams.cid;
        $scope.videos = videos;
      });
    };

    $scope.rmProduct = function(videoId, cid){
      var videos = $scope.videos;
      if (!videos){
        return;
      };

      Video.remove({cid: cid,id: videoId});
      for (var i=0; i<videos.length; i++){
        if (videos[i]._id == videoId){
          $scope.videos.splice(i, 1);
        }
      };
      $location.path('/vcate/'+cid+'/video');
    };
  }])
  .controller('companyCtrl', ['$scope', '$location', '$routeParams', 'Company', function($scope, $location, $routeParams, Company) {
    if ($routeParams.name) {
      console.log("name: ", $routeParams.name);
      console.log("language: ", $routeParams.lang);
      Company.get({name: $routeParams.name}, function(info){
        $scope.info = info;
      });
      if (editor){
        UE.getEditor('editor').destroy();
      }
      editor = UE.getEditor('editor');
      if (editor){
        editor.addListener( 'ready', function() {
          editor.setContent($scope.info.content[$routeParams.lang], true);
          editor.focus();
          editor.addListener('contentChange', function() {
            $scope.$apply(function () {
              $scope.info.content[$routeParams.lang] = editor.getContent();
            });
          });
        });
      }

      $scope.submit = function(){
        Company.save({name: $routeParams.name}, $scope.info, function(res){
          if (res.result === 'success'){
            $location.path('/company');
          } else if (res.result === 'failure') {
            $scope.alert = res.message;
          }
        });
      };
    } else {
      //Company.query(function(companies){
        //$scope.companies = companies;
      //});
      Company.get({name: "contact"}, function(contact){
        $scope.contact = contact;
      });
      Company.get({name: "partner"}, function(partner){
        $scope.partner = partner;
      });
      Company.get({name: "about"}, function(about){
        $scope.about = about;
      });
      Company.get({name: "delivery"}, function(delivery){
        $scope.delivery = delivery;
      });
      Company.get({name: "refund"}, function(refund){
        $scope.refund = refund;
      });
      Company.get({name: "warranty"}, function(warranty){
        $scope.warranty = warranty;
      });
      Company.get({name: "joinus"}, function(joinus){
        $scope.joinus = joinus;
      });
      Company.get({name: "manguide"}, function(manguide){
        $scope.manguide = manguide;
      });
      Company.get({name: "womanguide"}, function(womanguide){
        $scope.womanguide = womanguide;
      });
      Company.get({name: "sizedesc"}, function(sizedesc){
        $scope.sizedesc = sizedesc;
      });
      $scope.uploadFinished = function(e, data, name){
        $scope.partner.content.push(data.result.file.path);
      };
      $scope.submitAll = function(){
        Company.save({name: $scope.contact.title}, $scope.contact, function(res){
          if (res.result === 'failure') {
            $scope.alert = res.message;
          } else if (res.result === 'success') {
            $scope.alert = "更新成功!";
          };
        });
        Company.save({name: $scope.partner.title}, $scope.partner, function(res){
          if (res.result === 'failure') {
            $scope.alert = res.message;
          } else if (res.result === 'success') {
            $scope.alert = "更新成功!";
          };
        });
      };
    }
  }])
  .controller('orderCtrl', ['$scope', '$location', '$routeParams', '$http', 'Order', 'OrderSearch', function($scope, $location, $routeParams, $http, Order, OrderSearch) {
    if ($routeParams.id) {
      console.log("id: ", $routeParams.id);
      Order.get({id: $routeParams.id}, function(order){
        $scope.order = order;
      });

      var path_name = $location.path().replace(/(^\/*)/g, "");
      if (path_name.indexOf('delivery') > 1){
        $scope.submit = function(){
          // 发货
          $scope.order.state = 2;
          Order.save({id: $routeParams.id}, $scope.order, function(res){
            if (res.result === 'success'){
              $location.path('/order/'+$routeParams.id);
            } else if (res.result === 'failure') {
              $scope.alert = res.message;
            }
          });
        };
      } else if (path_name.indexOf('close') > 1){
        $scope.submit = function(){
          // 关闭订单
          $scope.order.state = 7;
          Order.save({id: $routeParams.id}, $scope.order, function(res){
            if (res.result === 'success'){
              $location.path('/order/'+$routeParams.id);
            } else if (res.result === 'failure') {
              $scope.alert = res.message;
            }
          });
        };
      }
    } else {
      $scope.searchstate = 'all';
      $scope.page = 1;
      $http.get('/admin/orders?state=' + $scope.searchstate + '&page=' + $scope.page).success(function(data){
        // orders
        $scope.orders = data.orders;
        // 总页数
        $scope.pages = data.pages;
        // 当前页码
        $scope.page = data.page;
      });

      $scope.submitReturn = function(id){
        if (id){
          Order.get({id: id}, function(order){
            //成功退货
            order.state = 6;
            Order.save({id:id}, order, function(res){
              if (res.result === 'success'){
                $location.path('/order/'+id);
              } else if (res.result === 'failure') {
                $scope.alert = res.message;
              }
            })
          });
        }
      };
      $scope.search = function(){
        $scope.page = 1;
        $http.get('/admin/orders?state=' + $scope.searchstate + '&page=' + $scope.page).success(function(data){
          $scope.orders = data.orders;
        });
      };

      $scope.loadPage = function() {
        $http.get('/admin/orders?state=' + $scope.searchstate + '&page=' + $scope.page).success(function(data){
          // orders
          $scope.orders = data.orders;
          // 总页数
          $scope.pages = data.pages;
          // 当前页码
          $scope.page = data.page;
        });
      };

      $scope.nextPage = function() {
        if ($scope.page < $scope.pages) {
          $scope.page++;
          $scope.loadPage();
        }
      };

      $scope.previousPage = function() {
        if ($scope.page > 1) {
          $scope.page--;
          $scope.loadPage();
        }
      };
    }
  }])
  .controller('settingCtrl', ['$scope', '$location', '$routeParams', 'Admin', function($scope, $location, $routeParams, Admin) {
    if ($routeParams.id) {
      if ($routeParams.id === "new"){
        // 创建新的admin
        $scope.admin = {name:"", password:""};
        $scope.existence = false;
        $scope.submit = function(){
          if ($scope.admin.password === $scope.admin.repassword){
            Admin.save({}, $scope.admin, function(res){
              if (res.result === 'success'){
                $location.path('/setting');
              } else if (res.result === 'failure') {
                $scope.alert = res.message;
              }
            });
          } else {
            $scope.alert = "两次密码不一致";
          };
        };
      } else {
        // 更新admin
        Admin.get({id: $routeParams.id}, function(admin){
          $scope.admin = admin;
          $scope.admin.password = "";
          $scope.existence = true;
          $scope.submit = function(){
            if ($scope.admin.password === $scope.admin.repassword){
              Admin.save({id: $routeParams.id}, $scope.admin, function(res){
                if (res.result === 'success'){
                  $location.path('/setting');
                } else if (res.result === 'failure') {
                  $scope.alert = res.message;
                }
              });
            } else {
              $scope.alert = "两次密码不一致";
            };
          };
        });
      };
    } else {
      // admin清单
      Admin.query(function(admins){
        $scope.admins = admins;
      });
    };

    $scope.rmAdmin = function(adminId){
      var admins = $scope.admins;
      if (!admins){
        return;
      };

      Admin.remove({id: adminId});
      for (var i=0; i<admins.length; i++){
        if (admins[i]._id == adminId){
          $scope.admins.splice(i, 1);
        }
      };
      $location.path('/setting');
    };
  }]);
