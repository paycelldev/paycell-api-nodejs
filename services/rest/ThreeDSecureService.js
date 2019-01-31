const { applicationName, applicationPassword, referenceNumberPrefix, restUrl, merchantCode } = require("../../Consts")

var moment = require("moment")
var request = require("request")
var devLogger = require("debug")("dev")

/*
3D doğrulama yöntemi ile işlem yapılması durumunda threeDSession ID bilgisi alınması amacıyla kullanılır.
 */
module.exports.getThreeDSession = function (req, res) {
  var transactionDateTime = moment().format("YYYYMMDDHHmmssSSS")
  var data = {
    requestHeader: {
      applicationName,
      applicationPwd: applicationPassword,
      clientIPAddress: req.connection.remoteAddress,
      transactionDateTime,
      transactionId: referenceNumberPrefix + transactionDateTime
    },
    merchantCode,
    target: "MERCHANT",
    transactionType: "AUTH",
    amount: req.body.amount,
    cardId: req.body.cardId,
    cardToken: req.body.cardId ? undefined : req.body.cardToken,
    installmentCount: req.body.installmentCount,
    msisdn: req.body.msisdn.substring(2)
  }
  devLogger("GetThreeDSession REST request: " + JSON.stringify(data, null, 2))
  request.post(restUrl.getThreeDSession, { json: data },
    function (error, response, body) {
      if (error) {
        //Error exits
        devLogger("Error: " + JSON.stringify(error, null, 2))
        res.end(JSON.stringify(error))
      } else {
        //Response is success
        devLogger("GetThreeDSession REST response: " + JSON.stringify(body, null, 2))
        res.end(JSON.stringify(body))
      }
    })
}

/*
3D doğrulama yöntemi ile işlem yapılması durumunda 3D doğrulama işleminin sonucunun sorgulanması amacıyla kullanılır.
*/
module.exports.getThreeDSessionResult = function (req, res) {
  var transactionDateTime = moment().format("YYYYMMDDHHmmssSSS")
  var data = {
    requestHeader: {
      applicationName,
      applicationPwd: applicationPassword,
      clientIPAddress: req.connection.remoteAddress,
      transactionDateTime,
      transactionId: referenceNumberPrefix + transactionDateTime
    },
    merchantCode,
    msisdn: req.body.msisdn,
    threeDSessionId: req.body.threeDSessionId
  }
  devLogger("GetThreeDSessionResult REST request: " + JSON.stringify(data, null, 2))
  request.post(restUrl.getThreeDSessionResult, { json: data },
    function (error, response, body) {
      if (error) {
        //Error exits
        devLogger("Error: " + JSON.stringify(error, null, 2))
        res.end(JSON.stringify(error))
      } else {
        //Response is success
        devLogger("GetThreeDSessionResult REST response: " + JSON.stringify(body, null, 2))
        res.end(JSON.stringify(body.threeDOperationResult))
      }
    })
}