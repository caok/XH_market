'use strict';

angular.module('myApp.directives', [])
  .directive('fileupload', function(){
    return {
      restrict: 'A',
      scope: {
        done: '&',
        progress: '&',
      },
      link: function(scope, element, attrs){
        var optionsObj = {
          dataType: 'json'
        };

        if (scope.done){
          optionsObj.done = function(e, data, name) {
            scope.$apply(function(){
              scope.done({e: e, data: data, name: name});
            });
          };
        }

        if(scope.progress) {
          optionsObj.progress = function(e, data) {
            scope.$apply(function(){
              scope.progress({e:e, data:data});
            });
          };
        }

        element.fileupload(optionsObj);
      }
    }
  });
