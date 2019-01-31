var threeDSecure = {

  /**
   * ThreeDSesssion başlatmak için kullanılır.
   * @param {*} msisdn müşteri telefon numarası
   * @param {*} cardId seçilen karta ait cardId
   * @param {*} cardToken kart bilgileri ile işlem yapıılıyorsa gönderilir
   * @param {*} amount işlem miktarı
   * @param {*} installmentCount taksit sayısı
   * @param {*} requestMethod soap/rest
   * @param {*} targetWindow threeDSEcure sayfası için hedef tab
   * @param {*} initCallback threeDSession başladıktan sonra çağrılır
   * @param {*} successCallback başarılı işlem sonrasında çağrılır
   */
  getThreeDSession: function (msisdn, cardId, cardToken, amount, installmentCount, requestMethod, targetWindow, initCallback, successCallback) {
    var threeDSecurePageWindow = targetWindow ? targetWindow : window.open("about:blank", "_blank")
    $.post("/api/" + requestMethod + "/getThreeDSession",
      {
        msisdn,
        cardId,
        cardToken,
        amount,
        installmentCount
      },
      function (data, status) {
        if (status == "success") {
          var response = JSON.parse(data)
          initCallback && initCallback(response)
          threeDSecurePageWindow.location = "/threeDSecurePage.html?threeDSessionId=" + response.threeDSessionId
          threeDSecure.checkResult(msisdn, successCallback, response, requestMethod);
        } else {
          alert(status)
        }
      })
  },
  checkResult: function (msisdn, successCallback, getThreeDSessionResponse, requestMethod) {
    var success = false
    startTimer(new Date(), 5000, 60000,
      function () { return success },
      function () {
        $.post("/api/" + requestMethod + "/getThreeDSessionResult",
          {
            msisdn,
            threeDSessionId: getThreeDSessionResponse.threeDSessionId
          },
          function (data, status) {
            if (status == "success") {
              var response = JSON.parse(data)
              if (response.threeDResult == 0) {
                success = true
                successCallback(getThreeDSessionResponse.threeDSessionId)
              }
            }
          })
      })
  }
}

var startTimer = function (startDate, interval, timeout, stopPredicate, action) {
  var timer = setInterval(function () {
    if (!stopPredicate() &&
      new Date().getTime() - startDate.getTime() < timeout) {
      action();
    } else {
      clearInterval(timer)
    }
  }, interval)
}