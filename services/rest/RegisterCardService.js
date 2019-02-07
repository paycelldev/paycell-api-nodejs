const { applicationPassword, applicationName, referenceNumberPrefix, restUrl } = require('../../Consts')

var moment = require('moment')
var request = require('request')
var devLogger = require('debug')('dev')

/*
Müşterinin Paycell’e kart eklemesi amacıyla kullanılır. registerCard çağrılmadan müşteriye güncel sözleşme metni gösterilir, müşterinin onaylaması durumunda registerCard servisi çağrılmalıdır. registerCard servisi çağrılmadan önce uygulama ekranından girilen kart bilgileri ile getCardToken servisi çağrılarak “token” değeri alınmış olunmalıdır. Kart Paycell’e eklendiğinde üye işyeri uygulamasına özel cardID değeri servis cevabında dönülür.
*/
module.exports.registerCard = function (req, res) {
  var data = {
    requestHeader: {
      applicationName,
      applicationPwd: applicationPassword,
      clientIPAddress: req.connection.remoteAddress,
      transactionDateTime: moment().format("YYYYMMDDHHmmssSSS"),
      transactionId: referenceNumberPrefix + moment().format("YYYYMMDDHHmmssSSS")
    },
    alias: req.body.alias,
    cardToken: req.body.cardToken,
    eulaId: req.body.eulaId,
    isDefault: req.body.isDefault,
    msisdn: String(req.body.msisdn),
    threeDSessionId: req.body.threeDSessionId ? String(req.body.threeDSessionId) : undefined
  }
  devLogger("RegisterCard REST request: " + JSON.stringify(data, null, 2))
  request.post(restUrl.registerCard, { json: data },
    function (error, response, body) {
      var responseText
      if (error) {
        devLogger("Error: " + JSON.stringify(error, null, 2))
        responseText = JSON.stringify(error)
      } else {
        devLogger("RegisterCard REST response: " + JSON.stringify(body, null, 2))
        res.end(JSON.stringify(body))
      }
    })
}