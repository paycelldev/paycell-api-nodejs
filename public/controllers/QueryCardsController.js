app.controller('queryCardsController', function ($rootScope, $scope, $http) {
  $scope.customCard = {
    expireDate: {}
  }

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
  }

  /**
   * Kayıtlı kartı seçmek için çağrılır
   */
  $scope.selectCard = function (card) {
    console.log("selected card: " + card.cardId)
    $rootScope.selectedCard = card;
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
        threeDSessionId
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
  $scope.updateCard = function (card) {
    if ($rootScope.threeDSecureEnabled) {
      threeDSecure.getThreeDSession(
        $rootScope.msisdn,
        card.cardId,
        undefined,
        1, 0,
        $rootScope.requestMethod,
        undefined,
        function (response) {

          console.log("threeDSessionId: " + response.threeDSessionId)
        },
        function (threeDSessionId) {
          $scope.sendUpdateCardRequest(card, threeDSessionId)
        })
    } else {
      $scope.sendUpdateCardRequest(card, undefined)
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
