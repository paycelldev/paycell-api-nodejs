var cardTokenUtil = {
  /*
   * Verilen kredi kartı bilgileriyle cardToken almak için ön yüzden
   * çağrılır.
   *
   * creditCardNo: pattern "\d{16}" expireDateMonth: pattern "\d{2}"
   * expireDateYear: pattern "\d{2}" cvcNo: pattern "\d{3}"
   * cardTokenCallback: cardToken alındıktan sonra çağrılır. signature
   * "function(cardToken)"
   */
  getCardToken: function (
    creditCardNo,
    expireDateMonth,
    expireDateYear,
    cvcNo,
    cardTokenCallback) {
    var transactionDateTime = generateTransactionDateTime();
    var request = {
      header: {
        applicationName: "PAYCELLTEST",
        transactionId: "001" + transactionDateTime,
        transactionDateTime
      },
      creditCardNo,
      expireDateMonth,
      expireDateYear,
      cvcNo
    };
    cardTokenUtil.hashRequest(
      request.header.transactionId,
      request.header.transactionDateTime,
      function (hashData) {
        request.hashData = hashData;
        cardTokenUtil.hashRequestCallback(request, cardTokenCallback);
      });
  },

  /*
   * Servis isteği hashlendikten sonra çağrılır
   */
  hashRequestCallback: function (request, cardTokenCallback) {
    console.log("getCardToken: " + JSON.stringify(request));
    post(getCardTokenUrl,
      request, function (responseJson) {
        console.log("getCardToken response: " + responseJson);
        var response = JSON.parse(responseJson);
        if (response.header.responseCode == "0") {
          cardTokenUtil.hashResponse(
            response.header.transactionId,
            response.header.responseDateTime,
            response.header.responseCode,
            response.cardToken,
            function (hashData) {
              cardTokenUtil.hashResponseCallback(response, hashData, cardTokenCallback);
            });
        } else {
          alert(response.header.responseDescription)
        }
      });
  },

  /*
   * Servis cevabı hashlendikten sonra çağrılır
   */
  hashResponseCallback: function (response, hashData, cardTokenCallback) {
    if (response.hashData == hashData) {
      cardTokenCallback(response.cardToken);
    }
  },

  /*
   * Servis isteğini hashlemek için kullanılır.
   */
  hashRequest: function (transactionId, transactionDateTime, callback) {
    var request = {
      transactionId,
      transactionDateTime
    }
    postJson(window.location.origin.concat("/api/hashRequest"), request, callback);
  },

  /*
   * Servis cevabını hashlemenk için kullanılır.
   */
  hashResponse: function (transactionId, responseDateTime, responseCode, cardToken, callback) {
    var request = {
      transactionId,
      responseDateTime,
      responseCode,
      cardToken
    }
    postJson(window.location.origin.concat("/api/hashResponse"), request, callback);
  }
}

/*
 * transactionDateTime üretir. Kullanılan format: yyyyMMddHHmmssSSS
 */
var generateTransactionDateTime = function () {
  var date = new Date();
  var year = String(date.getFullYear());
  var month = leadingZeros(date.getMonth() + 1, 2);
  var day = leadingZeros(date.getDate(), 2);
  var hours = leadingZeros(date.getHours(), 2);
  var minutes = leadingZeros(date.getMinutes(), 2);
  var seconds = leadingZeros(date.getSeconds(), 2);
  var milliseconds = leadingZeros(date.getMilliseconds(), 3);
  return year + month + day + hours + minutes + seconds + milliseconds;
}

/*
 * Verilen basamak sayısını sağlamak için başına 0 ekler
 */
var leadingZeros = function (text, digits) {
  var result = String(text);
  while (result.length < digits) {
    result = "0" + result;
  }
  return result;
}

/*
 * Json formatında verlien servis urlsine post gönderir. Cevap alınınca callback
 * fonksiyonu çağrılır. Signature: "callback(responseBody)"
 */
var postJson = function (url, request, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(this.responseText);
    }
  };
  xhttp.open("POST", url, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(request));
}

/*
 * Json formatında verlien servis urlsine post gönderir. Cevap alınınca callback
 * fonksiyonu çağrılır. Signature: "callback(responseBody)"
 */
var post = function (url, request, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(this.responseText);
    }
  };
  xhttp.open("POST", url, true);
  xhttp.send(JSON.stringify(request));
}