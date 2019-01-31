const { applicationName, applicationPassword, referenceNumberPrefix, restUrl } = require("../../Consts")

var moment = require("moment")
var request = require("request")
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
  devLogger("DeleteCard REST request: " + JSON.stringify(data, null, 2))
  request.post(restUrl.deleteCard, { json: data },
    function (error, response, body) {
      if (error) {
        devLogger("Error: " + JSON.stringify(error, null, 2))
        res.end(JSON.stringify(error))
      } else {
        devLogger("DeleteCard REST response: " + JSON.stringify(body, null, 2))
        res.end(JSON.stringify(body))
      }
    })
}