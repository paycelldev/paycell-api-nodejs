const { applicationName, applicationPassword, referenceNumberPrefix, soapUrl } = require("../../Consts")

var moment = require("moment")
var soap = require("soap")
var devLogger = require("debug")("dev")

/* 
Paycell’de tanımlı bir kartın silinmesi amacıyla kullanılır. Kart otomatik ödeme talimatıyla ilişkili olmadığı sürece silinebilir.
*/
module.exports.deleteCard = function (req, res) {
  var transactionDateTime = moment().format("YYYYMMDDHHmmssSSS")
  var data = {
    cardId: req.body.cardId,
    msisdn: String(req.body.msisdn),
    requestHeader: {
      applicationName,
      applicationPwd: applicationPassword,
      clientIPAddress: req.connection.remoteAddress,
      transactionDateTime,
      transactionId: referenceNumberPrefix + transactionDateTime
    }
  }
  devLogger("DeleteCard SOAP request: " + JSON.stringify(data, null, 2))
  soap.createClient(soapUrl, function (error, client) {
    client.deleteCard(data, function (error, result) {
      if (error) {
        devLogger("Error: " + JSON.stringify(error, null, 2))
        res.end(JSON.stringify(error))
      } else {
        devLogger("DeleteCard SOAP response: " + JSON.stringify(result, null, 2))
        res.end(JSON.stringify(result))
      }
    })
  })
}