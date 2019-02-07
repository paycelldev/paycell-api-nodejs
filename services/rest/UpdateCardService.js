const { applicationName, applicationPassword, referenceNumberPrefix, restUrl } = require('../../Consts')

var moment = require("moment")
var request = require("request")
var devLogger = require("debug")("dev")

/*
Kartın alias, isDefault ve sözleşme metni versiyon numaralarının güncellenmesi amacıyla kullanılır. Ayrıca 3D doğrulama yöntemi ile eklenmemiş bir kart için 3D doğrulama yapılarak 3D validasyon bilgisi güncellenebilir. Sözleşme metni güncel olmayan (getCards servisi cevabında showEulaId = True dönülen) kart için kullanıcıya güncel sözleşme metni gösterilerek, onaylaması durumunda updateCard servisi çağrılmalıdır.
 */
module.exports.updateCard = function (req, res) {
  const transactionDateTime = moment().format("YYYYMMDDHHmmssSSS")
  var data = {
    requestHeader: {
      applicationName,
      applicationPwd: applicationPassword,
      clientIPAddress: req.connection.remoteAddress,
      transactionDateTime,
      transactionId: referenceNumberPrefix + transactionDateTime
    },
    alias: req.body.alias,
    cardId: req.body.cardId,
    eulaId: req.body.eulaId,
    isDefault: req.body.isDefault,
    msisdn: String(req.body.msisdn),
    threeDSessionId: req.body.threeDSessionId ? String(req.body.threeDSessionId) : undefined
  }
  devLogger("UpdateCard REST request: " + JSON.stringify(data, null, 2))
  request.post(restUrl.updateCard, { json: data },
    function (error, response, body) {
      if (error) {
        //Error exits
        devLogger("Error: " + JSON.stringify(error, null, 2))
        res.end(JSON.stringify(error))
      } else {
        //Response is success
        devLogger("UpdateCard REST response: " + JSON.stringify(body, null, 2))
        res.end(JSON.stringify(body))
      }
    })
}