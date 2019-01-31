app.controller("inquireController", function ($scope, $rootScope, $http) {

  /*
    Ödeme sorgulanmak istendiği zaman çağrılır
  */
  $scope.inquire = function () {
    $http({
      method: "POST",
      url: "/api/" + $rootScope.requestMethod + "/inquire",
      data: {
        msisdn: $rootScope.msisdn,
        originalReferenceNumber: $scope.originalReferenceNumber
      }
    }).then(function (response) {
      if (response.data.responseHeader.responseCode == 0) {
        $scope.orderId = response.data.orderId
        $scope.acquirerBankCode = response.data.acquirerBankCode
        $scope.status = response.data.status
        $scope.provisionList = response.data.provisionList
      } else {
        alert(response.data.responseHeader.responseDescription)
      }
    })
  }

  /*
    Ödeme işlemi iptal etmek istendiği zaman çağrılır
  */
  $scope.reverse = function () {
    $http({
      method: "POST",
      url: "/api/" + $rootScope.requestMethod + "/reverse",
      data: {
        msisdn: $rootScope.msisdn,
        originalReferenceNumber: $scope.originalReferenceNumber
      }
    }).then(function (response) {
      alert(response.data.responseHeader.responseDescription)
      $scope.inquire()
    })
  }

  /*
    Ödeme işleme iade etmek istenildiği zaman çağrılır
  */
  $scope.refund = function () {
    $http({
      method: "POST",
      url: "/api/" + $rootScope.requestMethod + "/refund",
      data: {
        msisdn: $rootScope.msisdn,
        originalReferenceNumber: $scope.originalReferenceNumber,
        amount: $scope.refundAmount
      }
    }).then(function (response) {
      alert(response.data.responseHeader.responseDescription)
      $scope.inquire()
    })
  }
})