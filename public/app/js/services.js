'use strict';

angular.module('myApp.services', ['ngResource'])
.factory('Category', ['$resource',
  function($resource){
    return $resource('/admin/category/:id', {id: '@id'});
}])
.factory('Product', ['$resource',
  function($resource){
    return $resource('/admin/category/:cid/product/:id', {cid: '@cid', id: '@id'});
}])
.factory('Vcategory', ['$resource',
  function($resource){
    return $resource('/admin/vcategory/:id', {id: '@id'});
}])
.factory('Video', ['$resource',
  function($resource){
    return $resource('/admin/vcategory/:cid/video/:id', {cid: '@cid', id: '@id'});
}])
.factory('Order', ['$resource',
  function($resource){
    return $resource('/admin/order/:id', {id: '@id'}, {
      get:   {method:'GET'},
      query: {method:'GET', isArray:true},
      save:  {method:'POST'},
    });
}])
.factory('OrderSearch', ['$resource',
  function($resource){
    return $resource('/admin/orders/:state', {state: '@state'}, {
      get: {method:'GET', isArray:true},
    });
}])
.factory('Company', ['$resource',
  function($resource){
    return $resource('/admin/company/:name', {name: '@name'});
}])
.factory('Admin', ['$resource',
  function($resource){
    return $resource('/admin/setting/:id', {id: '@id'});
}]);
