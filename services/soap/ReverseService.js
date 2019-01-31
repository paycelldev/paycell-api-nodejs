const { merchantCode, referenceNumberPrefix, applicationName, applicationPassword, soapUrl } = require('../../Consts')

var moment = require('moment')
var soap = require('soap')
var devLogger = require('debug')('dev')

/*
Yapılan ödeme işleminin iptal edilmesi amacıyla kullanılır. İptal işlemi iki şekilde çağırabilir. Provision servisine cevap alınamayarak timeout alınması durumunda, işlem mutabakatının sağlanması amacıyla sistem tarafından reverse gönderilebilir. Müşterinin iptal talebi olması durumunda üye işyeri tarafından manuel olarak çağrılabilir.
*/
module.exports.reverse = function (req, res) {
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
  devLogger("Reverse SOAP request: " + JSON.stringify(data, null, 2))
  soap.createClient(soapUrl, function (error, client) {
    client.reverse(data, function (error, result) {
      if (error) {
        devLogger("Error: " + JSON.stringify(error, null, 2))
        res.end(JSON.stringify(error))
      } else {
        devLogger("Reverse SOAP response: " + JSON.stringify(result, null, 2))
        res.end(JSON.stringify(result))
      }
    })
  })
}