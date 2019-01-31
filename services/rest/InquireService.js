const { merchantCode, referenceNumberPrefix, applicationName, applicationPassword, restUrl } = require('../../Consts')

var moment = require('moment')
var request = require('request')
var devLogger = require('debug')('dev')

/*
Yapılan ödemenin işlem sonucunun sorgulanması amacıyla kullanılır. Provision servisi senkron olarak işlem sonucunu dönmektedir, ancak provision servisine herhangi bir teknik arıza sebebiyle cevap dönülememesi sonrasında işlem timeout’a düştüğünde işlemin sonucu inquire ile sorgulanabilir. inquire servisi yapılan işleme ilişkin işlemin son durumunu ve işlemin tarihçe bilgisini iletir.
*/
module.exports.inquire = function (req, res) {
  var transactionDateTime = moment().format("YYYYMMDDHHmmssSSS")
  var data = {
    merchantCode,
    msisdn: String(req.body.msisdn).substring(2),
    originalReferenceNumber: req.body.originalReferenceNumber,
    referenceNumber: referenceNumberPrefix + transactionDateTime,
    requestHeader: {
      applicationName,
      applicationPwd: applicationPassword,
      clientIPAddress: req.connection.remoteAddress,
      transactionDateTime,
      transactionId: referenceNumberPrefix + transactionDateTime
    }
  }
  devLogger("Inquire REST request: " + JSON.stringify(data, null, 2))
  request.post(restUrl.inquire, { json: data },
    function (error, response, body) {
      if (error) {
        devLogger("Error: " + JSON.stringify(error, null, 2))
        res.end(JSON.stringify(error))
      } else {
        devLogger("Inquire REST response: " + JSON.stringify(body, null, 2))
        res.end(JSON.stringify(body))
      }
    })
}