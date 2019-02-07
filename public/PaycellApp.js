var app = angular.module('paycell', ['ngSanitize']);
app.run(function ($rootScope) {
  $rootScope.requestMethod = "rest"
  $rootScope.threeDSecureEnabled = false
})