'use strict';

angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/index',    {templateUrl: 'partials/index', controller: 'indexCtrl'});
  $routeProvider.when('/about',    {templateUrl: 'partials/about', controller: 'indexCtrl'});
  $routeProvider.when('/category', {templateUrl: 'partials/category', controller: 'categoryCtrl'});
  $routeProvider.when('/category/:id', {templateUrl: 'partials/categoryForm', controller: 'categoryCtrl'});
  $routeProvider.when('/category/:cid/product', {templateUrl: 'partials/product', controller: 'productCtrl'});
  $routeProvider.when('/category/:cid/product/:id', {templateUrl: 'partials/productForm', controller: 'productCtrl'});
  $routeProvider.when('/order', {templateUrl: 'partials/orders', controller: 'orderCtrl'});
  $routeProvider.when('/order/:id', {templateUrl: 'partials/order', controller: 'orderCtrl'});
  $routeProvider.when('/order/:id/close', {templateUrl: 'partials/orderClose', controller: 'orderCtrl'});
  $routeProvider.when('/order/:id/delivery', {templateUrl: 'partials/orderDelivery', controller: 'orderCtrl'});
  $routeProvider.when('/vcate', {templateUrl: 'partials/vcategory', controller: 'vcategoryCtrl'});
  $routeProvider.when('/vcate/:id', {templateUrl: 'partials/vcategoryForm', controller: 'vcategoryCtrl'});
  $routeProvider.when('/vcate/:cid/video', {templateUrl: 'partials/video', controller: 'videoCtrl'});
  $routeProvider.when('/vcate/:cid/video/:id', {templateUrl: 'partials/videoForm', controller: 'videoCtrl'});
  $routeProvider.when('/company', {templateUrl: 'partials/company', controller: 'companyCtrl'});
  $routeProvider.when('/company/:name/:lang', {templateUrl: 'partials/companyForm', controller: 'companyCtrl'});
  $routeProvider.when('/setting', {templateUrl: 'partials/admin', controller: 'settingCtrl'});
  $routeProvider.when('/setting/:id', {templateUrl: 'partials/adminForm', controller: 'settingCtrl'});
  $routeProvider.otherwise({redirectTo: '/index'});
}]);
