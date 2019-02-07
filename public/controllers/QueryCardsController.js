app.controller('queryCardsController', function ($rootScope, $scope, $http) {
  $scope.customCard = {
    expireDate: {}
  }

  $scope.eulaTextTR = "<div></div>"
  $scope.eulaTextEN = "<div></div>"

  /**
   * Verilen bilgilere ait kartlar servisten sorgulanır.
   */
  $scope.queryCards = function () {
    $http({
      method: "POST",
      url: "/api/" + $rootScope.requestMethod + "/queryCards",
      data: { msisdn: $rootScope.msisdn }
    }).then(function (response) {
      if (response.data.responseHeader.responseCode == 0) {
        $scope.cardList = response.data.cardList
      } else {
        alert(response.data.responseHeader.responseDescription);
      }
    })
    $http({
      method: "POST",
      url: "/api/" + $rootScope.requestMethod + "/getTermsOfServiceContent",
      data: { msisdn: $rootScope.msisdn }
    }).then(function (response) {
      if (response.data.responseHeader.responseCode == 0) {
        $scope.eulaId = response.data.eulaId
        $scope.eulaTextTR = response.data.termsOfServiceHtmlContentTR
        $scope.eulaTextEN = response.data.termsOfServiceHtmlContentEN
      } else {
        alert(response.data.responseHeader.responseDescription);
      }
    })
  }

  /**
   * Eula ekranını gösterir
   * Action fonksiyonu eula kabul edilirse çağrılır
   */
  $scope.showEula = function (validate, action) {
    if (validate && !validate()) return;
    $scope.eulaAcceptedAction = action;
    $http({
      method: "POST",
      url: "/api/" + $rootScope.requestMethod + "/getTermsOfServiceContent",
      data: { msisdn: $rootScope.msisdn }
    }).then(function (response) {
      if (response.data.responseHeader.responseCode == 0) {
        $scope.eulaId = response.data.eulaId
        $scope.eulaTextTR = response.data.termsOfServiceHtmlContentTR
        $scope.eulaTextEN = response.data.termsOfServiceHtmlContentEN
        $scope.isEulaVisible = true;
      } else {
        alert(response.data.responseHeader.responseDescription);
      }
    })
  }

  /**
   * Eula ekranını kapatır ve kabul aksiyonunu çağırır
   */
  $scope.acceptEula = function () {
    $scope.isEulaVisible = false;
    $scope.eulaAcceptedAction();
  }

  /**
   * Eula ekranını kapatır
   */
  $scope.cancelEula = function () {
    $scope.isEulaVisible = false;
  }

  /**
   * Kayıtlı kartı seçmek için çağrılır
   */
  $scope.selectCard = function (card) {
    console.log("selected card: " + card.cardId)
    $rootScope.selectedCard = card;
  }

  $scope.validateCustomCard = function () {
    if (!$scope.customCard) {
      alert("Enter card info!")
      return false;
    }
    if (!$scope.customCard.alias) {
      alert("Enter card alias!")
      return false;
    }
    if (!$scope.customCard.cardNo) {
      alert("Enter card no!")
      return false;
    }
    if (!$scope.customCard.expireDate
      || !$scope.customCard.expireDate.month
      || !$scope.customCard.expireDate.year) {
      alert("Enter expire date!")
      return false;
    }
    if ($scope.customCard.expireDate.month <= 0 || $scope.customCard.expireDate.month > 12) {
      alert("Enter a valid expire month!")
      return false;
    }
    if (!$scope.customCard.cvc) {
      alert("Enter cvc!")
      return false;
    }
    return true;
  }

  /**
   * Kayıtlı olmayan bir kartı seçmek için kullanılır.
   */
  $scope.selectCustomCard = function () {
    $rootScope.selectedCard = $scope.customCard;
  }

  /**
   * kart bilgileri sisteme kaydedilir.
   */
  $scope.registerCard = function () {
    var threeDSecureWindow = $rootScope.threeDSecureEnabled ? window.open("about:blank", "_blank") : undefined
    cardTokenUtil.getCardToken(
      $scope.customCard.cardNo,
      $scope.customCard.expireDate.month,
      $scope.customCard.expireDate.year,
      $scope.customCard.cvc,
      function (cardToken) {
        if ($rootScope.threeDSecureEnabled) {
          threeDSecure.getThreeDSession(
            $rootScope.msisdn,
            undefined,
            cardToken,
            1,
            0,
            $rootScope.requestMethod,
            threeDSecureWindow,
            function (response) {
              console.log("threeDSessionId: " + response.threeDSessionId)
            }, function (threeDSessionId) {
              $scope.sendRegisterCardRequest(cardToken, threeDSessionId)
            }
          )
        } else {
          $scope.sendRegisterCardRequest(cardToken, undefined)
        }
      })
  }

  /**
   * kart kayıt servis çağrısı gönderilir
   */
  $scope.sendRegisterCardRequest = function (token, threeDSessionId) {
    $http({
      method: "POST",
      url: "/api/" + $rootScope.requestMethod + "/registerCard",
      data: {
        alias: $scope.customCard.alias,
        isDefault: $scope.customCard.isDefault,
        cardToken: token,
        msisdn: $rootScope.msisdn,
        threeDSessionId,
        eulaId: $scope.eulaId
      }
    }).then(function (response) {
      alert(response.data.responseHeader.responseDescription)
      $scope.queryCards()
    })
  }

  /**
   * Kayıtlı bir kartı silmek için kullanılır.
   */
  $scope.deleteCard = function (card) {
    $http({
      method: "POST",
      url: "/api/" + $rootScope.requestMethod + "/deleteCard",
      data: {
        cardId: card.cardId,
        msisdn: $rootScope.msisdn
      }
    }).then(function (response) {
      alert(response.data.responseHeader.responseDescription)
      if (response.data.responseHeader.responseCode == 0) {
        for (var i = 0; i < $scope.cardList.length; i++) {
          if ($scope.cardList[i].cardId == card.cardId) {
            $scope.cardList.splice(i, 1)
            break;
          }
        }
        $rootScope.selectedCard = undefined
        $scope.queryCards()
      }
    })
  }

  /**
   * seçilen kart için düzenleme modu açılır
   */
  $scope.enableEditModeForCard = function (card) {
    card.editMode = true;
  }

  /**
   * Seçilen kart bilgileri sistemde güncellenir
   */
  $scope.updateCard = function () {
    if ($rootScope.threeDSecureEnabled) {
      threeDSecure.getThreeDSession(
        $rootScope.msisdn,
        $rootScope.selectedCard.cardId,
        undefined,
        1, 0,
        $rootScope.requestMethod,
        undefined,
        function (response) {

          console.log("threeDSessionId: " + response.threeDSessionId)
        },
        function (threeDSessionId) {
          $scope.sendUpdateCardRequest($rootScope.selectedCard, threeDSessionId)
        })
    } else {
      $scope.sendUpdateCardRequest($rootScope.selectedCard, undefined)
    }
  }

  /**
   * Kayıt güncelleme için servis çağrılır
   */
  $scope.sendUpdateCardRequest = function (card, threeDSessionId) {
    $http({
      method: "POST",
      url: "/api/" + $rootScope.requestMethod + "/updateCard",
      data: {
        msisdn: $rootScope.msisdn,
        cardId: card.cardId,
        alias: card.alias,
        isDefault: card.isDefault,
        eulaId: $scope.eulaId,
        threeDSessionId
      }
    }).then(function (response) {
      alert(response.data.responseHeader.responseDescription)
      if (response.data.responseHeader.responseCode == 0) {
        card.editMode = false;
        $scope.queryCards();
      }
    })
  }
})
