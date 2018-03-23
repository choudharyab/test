'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', ['$scope','$location','$timeout','loginService',function($scope,$location,$timeout,loginService) {

    $scope.loginFunction = function(){

      loginService({
        username:$scope.username,
        password:$scope.password
      }).then(function(res){

        $scope.login_modal_dismiss();

        $scope.username = '';
        $scope.password = '';

        var promise = $timeout(function() {
          $location.path('/view2')
        }, 500);
      })
    }

  }])
  .controller('MyCtrl2', ['$scope','$http',function($scope,$http) {

    

  }]);