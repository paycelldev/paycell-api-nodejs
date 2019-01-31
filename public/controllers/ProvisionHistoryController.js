app.controller("provisionHistoryController", function ($scope, $rootScope, $http) {

  /**
   * Ödeme geçmişi servis üzerinden sorgulanır.
   */
  $scope.getProvisionHistory = function () {
    $http({
      method: "POST",
      url: "/api/" + $rootScope.requestMethod + "/getProvisionHistory",
      data: {
        reconciliationDate: $scope.reconciliationDate
      }
    }).then(function (response) {
      if (response.data.responseHeader.responseCode == 0) {
        $scope.transactionList = response.data.transactionList
      } else {
        alert(response.data.responseHeader.responseDescription)
      }
    })
  }
})