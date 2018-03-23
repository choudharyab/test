'use strict';

/* Directives */


angular.module('myApp.directives', []).directive('closeLogin', function() {
  return {
      restrict: 'A',
      link: function(scope, element, attr) {
          scope.login_modal_dismiss = function() {
              element.modal('hide');
          };
      }
  }
}).directive('uploadMyFile', function () {

    return {
  
        scope: true,        //create a new scope
  
        link: function (scope, el, attrs) {
  
            el.bind('change', function (event) {
  
                var files = event.target.files;
  
                //iterate files since 'multiple' may be specified on the element
  
                for (var i = 0; i < files.length; i++) {
  
                    //emit event upward
  
                    scope.$emit("selectedFile", { file: files[i] });
  
                }
  
            });
  
        }
  
    };
  
  });
