var app = angular.module('paycell', []);
app.run(function ($rootScope) {
  $rootScope.requestMethod = "rest"
  $rootScope.threeDSecureEnabled = false
})