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

        totalPostAuthAmount: $scope.totalPostAuthAmount,
        totalPostAuthCount: $scope.totalPostAuthCount,
        totalPostAuthReverseAmount: $scope.totalPostAuthReverseAmount,
        totalPostAuthReverseCount: $scope.totalPostAuthReverseCount,
        totalPreAuthAmount: $scope.totalPreAuthAmount,
        totalPreAuthReverseAmount: $scope.totalPreAuthReverseAmount,
        totalPreAuthReverseCount: $scope.totalPreAuthReverseCount,
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

        if (response.data.totalPostAuthAmount != null && response.data.totalPostAuthAmount != "") {
            $scope.systemTotalPostAuthAmount = response.data.totalPostAuthAmount
            $scope.systemTotalPostAuthCount = response.data.totalPostAuthCount
            $scope.systemTotalPostAuthReverseAmount = response.data.totalPostAuthReverseAmount
            $scope.systemTotalPostAuthReverseCount = response.data.totalPostAuthReverseCount
            $scope.systemTotalPreAuthAmount = response.data.totalPreAuthAmount
            $scope.systemTotalPreAuthCount = response.data.totalPreAuthCount
            $scope.systemTotalPreAuthReverseAmount = response.data.totalPreAuthReverseAmount
            $scope.systemTotalPreAuthReverseCount = response.data.totalPreAuthReverseCount
        }    
      } else {
        alert(response.data.responseHeader.responseDescription)
      }
    })
  }
})