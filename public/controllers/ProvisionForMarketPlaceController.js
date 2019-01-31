app.controller("provisionForMarketPlaceController", function ($scope, $rootScope, $http) {
  $scope.extraParameters = []
  $scope.subMerchants = []

  /**
   * Boş bir extra parametre eklenir
   */
  $scope.addExtraParameter = function () {
    $scope.extraParameters.push({})
  }

  /**
   * Boş bir alt üye işyeri eklenir
   */
  $scope.addSubMerchant = function () {
    $scope.subMerchants.push({});
  }

  /**
   * seçilen extra parametre listeden kaldırılır
   */
  $scope.deleteExtraParameter = function (extraParameter) {
    for (var i = 0; i < $scope.extraParameters.length; i++) {
      if ($scope.extraParameters[i] === extraParameter) {
        $scope.extraParameters.splice(i, 1)
        break
      }
    }
  }

  /**
   * Seçilen alt üye işyeri listeden kaldırılır
   */
  $scope.deleteSubMerchant = function (subMerchant) {
    for (var i = 0; i < $scope.subMerchants.length; i++) {
      if ($scope.subMerchants[i] === subMerchant) {
        $scope.subMerchants.splice(i, 1)
        break
      }
    }
  }

  /**
   * Ödeme işlemi başlatılır.
   */
  $scope.provisionForMarketPlace = function () {
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
          $scope.startProvisionForMarketPlace(cardToken, threeDSecurePage)
        })
    } else {
      $scope.startProvisionForMarketPlace(undefined, threeDSecurePage)
    }

  }

  /**
   * @param cardToken kart bilgileri ile işlem yapılmak istendiğinde gönderilir
   * @param threeDSecurePage threeDSecure sayfasının açılmak istendiği tab değişkeni gönderilir
   */
  $scope.startProvisionForMarketPlace = function (cardToken, threeDSecurePage) {
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
          $scope.sendProvisionForMarketPlaceRequest(cardToken, threeDSessionId)
        })
    } else {
      $scope.sendProvisionForMarketPlaceRequest(cardToken, undefined)
    }
  }

  /**
   * Servis çağrısı yapılır
   */
  $scope.sendProvisionForMarketPlaceRequest = function (cardToken, threeDSessionId) {
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
        threeDSessionId,
        extraParameters: $scope.extraParameters,
        subMerchants: $scope.subMerchants
      }
    }).then(function (response) {
      if (response.data.responseHeader.responseCode == 0) {
        $scope.referenceNumber = response.data.referenceNumber
      }
      alert(response.data.responseHeader.responseDescription)
    })
  }
})