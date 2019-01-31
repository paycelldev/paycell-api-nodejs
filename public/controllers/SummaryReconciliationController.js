app.controller("summaryReconcilationController", function ($scope, $rootScope, $http) {

  /**
   * Mutabakat işlemi yapılmak üzere servis çağrılır
   */
  $scope.summaryReconciliation = function () {
    $http({
      method: "POST",
      url: "/api/" + $rootScope.requestMethod + "/summaryReconciliation",
      data: {
        reconciliationDate: $scope.reconciliationDate,
        totalRefundAmount: $scope.totalRefundAmount,
        totalRefundCount: $scope.totalRefundCount,
        totalReverseAmount: $scope.totalReverseAmount,
        totalReverseCount: $scope.totalReverseCount,
        totalSaleAmount: $scope.totalSaleAmount,
        totalSaleCount: $scope.totalSaleCount,
      }
    }).then(function (response) {
      if (response.data.responseHeader.responseCode == 0) {
        $scope.reconciliationResult = response.data.reconciliationResult
        $scope.systemTotalRefundAmount = response.data.totalRefundAmount
        $scope.systemTotalRefundCount = response.data.totalRefundCount
        $scope.systemTotalReverseAmount = response.data.totalReverseAmount
        $scope.systemTotalReverseCount = response.data.totalReverseCount
        $scope.systemTotalSaleAmount = response.data.totalSaleAmount
        $scope.systemTotalSaleCount = response.data.totalSaleCount
      } else {
        alert(response.data.responseHeader.responseDescription)
      }
    })
  }
})