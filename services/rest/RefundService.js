const { merchantCode, referenceNumberPrefix, applicationName, applicationPassword, restUrl } = require('../../Consts')

var moment = require('moment')
var request = require('request')
var devLogger = require('debug')('dev')

/*
Yapılan ödeme işleminin iade edilmesi amacıyla kullanılır. İade, işlemin günsonu ardından ertesi günden itibaren iptal edilemesi veya belirli bir tutarın iade edilmesi amacıyla kullanılır. İptal işlemi iki şekilde çağırabilir. Provision servisine cevap alınamayarak timeout alınması durumunda, işlem mutabakatının sağlanması amacıyla şayet günsonu olmuş ise sistem tarafından refund gönderilebilir. Müşterinin iade talebi olması durumunda üye işyeri tarafından manuel olarak çağrılabilir. İade işlemi birden fazla sayıda çağrılabilir, iptal edilmiş bir işlem için iade işlemi gerçekleştirilemez, toplam iade tutarı işlem tutarının üzerinde olamaz.
*/
module.exports.refund = function (req, res) {
  var transactionDateTime = moment().format("YYYYMMDDHHmmssSSS")
  var data = {
    merchantCode,
    msisdn: String(req.body.msisdn).substring(2),
    originalReferenceNumber: req.body.originalReferenceNumber,
    amount: req.body.amount,
    referenceNumber: referenceNumberPrefix + transactionDateTime,
    requestHeader: {
      applicationName,
      applicationPwd: applicationPassword,
      clientIPAddress: req.connection.remoteAddress,
      transactionDateTime,
      transactionId: referenceNumberPrefix + transactionDateTime
    }
  }
  devLogger("Refund REST request: " + JSON.stringify(data, null, 2))
  request.post(restUrl.refund, { json: data },
    function (error, response, body) {
      if (error) {
        devLogger("Error: " + JSON.stringify(error, null, 2))
        res.end(JSON.stringify(error))
      } else {
        devLogger("Refund REST response: " + JSON.stringify(body, null, 2))
        res.end(JSON.stringify(body))
      }
    })
}