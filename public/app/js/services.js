'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
 angular.module('myApp.services', []).factory('loginService',function($http){
  return function (params) {
      return $http.post('/api/login', $.param(params),{headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      })
  }
})
 //.factory('loginService',function($http){
//     return function (params) {
//         return $http.get('/api/login',{params:params,header:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'}
//         })
//     }
//  });
