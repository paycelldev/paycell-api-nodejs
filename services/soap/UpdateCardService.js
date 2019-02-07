const { applicationName, applicationPassword, referenceNumberPrefix, soapUrl } = require('../../Consts')

var moment = require("moment")
var devLogger = require("debug")("dev")
var soap = require('soap')

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
  devLogger("UpdateCard SOAP request: " + JSON.stringify(data, null, 2))
  soap.createClient(soapUrl, function (error, client) {
    client.updateCard(data, function (error, result) {
      if (error) {
        //Error exits
        devLogger("Error: " + JSON.stringify(error, null, 2))
        res.end(JSON.stringify(error))
      } else {
        //Response is success
        devLogger("UpdateCard SOAP response: " + JSON.stringify(result, null, 2))
        res.end(JSON.stringify(result))
      }
    })
  })
}