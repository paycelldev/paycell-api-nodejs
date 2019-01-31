app.controller("provisionController", function ($scope, $rootScope, $http) {

  /*
    Ödeme işlemi yapılmak istendiğinde  çağrılır.
  */
  $scope.provision = function () {
    var cardNo, expireMonth, expireYear, cvc
    if ($rootScope.selectedCard.cardId) {
      //Operation with registeredCard
      cvc = $scope.cvc
    } else {
      //Operation with custom card
      cardNo = $rootScope.selectedCard.cardNo
      expireMonth = $rootScope.selectedCard.expireDate.month
      expireYear = $rootScope.selectedCard.expireDate.year
      cvc = $rootScope.selectedCard.cvc
    }
    var threeDSecurePage = $rootScope.threeDSecureEnabled ? window.open("about:blank", "_blank") : undefined;
    if (cardNo || expireMonth || expireYear || cvc) {
      cardTokenUtil.getCardToken(cardNo, expireMonth, expireYear, cvc,
        function (cardToken) {
          $scope.startProvision(cardToken, threeDSecurePage)
        })
    } else {
      $scope.startProvision(undefined, threeDSecurePage)
    }

  }

  /**
   * @param cardToken kredi kartı bilgileriyle işlem yapılmak istendğiğnde gönderilir.
   * @param threeDSecurePage threeDSecure sayfasının açılmak istenilen tab için window değişkeni gönderilir
   */
  $scope.startProvision = function (cardToken, threeDSecurePage) {
    if ($rootScope.threeDSecureEnabled) {
      threeDSecure.getThreeDSession(
        $rootScope.msisdn,
        $rootScope.selectedCard.cardId,
        cardToken,
        $scope.amount,
        $scope.installmentCount,
        $rootScope.requestMethod,
        threeDSecurePage,
        function (response) {
          console.log("threeDSessionId: " + response.threeDSessionId)
          $scope.threeDSessionId = response.threeDSessionId
        },
        function (threeDSessionId) {
          $scope.sendProvisionRequest(cardToken, threeDSessionId)
        })
    } else {
      $scope.sendProvisionRequest(cardToken, undefined)
    }
  }

  /*
    Ödeme işlemi yapmak için servis isteği yapılır.
  */
  $scope.sendProvisionRequest = function (cardToken, threeDSessionId) {
    $http({
      method: "POST",
      url: "/api/" + $rootScope.requestMethod + "/provision",
      data: {
        msisdn: $rootScope.msisdn,
        cardId: $rootScope.selectedCard.cardId,
        cardToken,
        amount: $scope.amount,
        currency: $scope.currency,
        installmentCount: $scope.installmentCount,
        paymentType: $scope.paymentType,
        threeDSessionId
      }
    }).then(function (response) {
      if (response.data.responseHeader.responseCode == 0) {
        $scope.referenceNumber = response.data.referenceNumber
      }
      alert(response.data.responseHeader.responseDescription)
    })
  }
})