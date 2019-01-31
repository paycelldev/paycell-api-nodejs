const { soapUrl, applicationName, applicationPassword, referenceNumberPrefix } = require('../../Consts')

var moment = require('moment')
var devLogger = require('debug')('dev')
var soap = require('soap')

/*
Müşterinin Paycell’de tanımlı kartlarının sorgulanması amacıyla kullanılır. getCards ile Paycell’de tanımlı kartlar liste halinde iletilir. Müşterinin, üye işyerinin uygulama ekranında ilk kez Paycell’de tanımlı kartlarının sorgulanması durumunda öncelikle müşterinin veri paylaşım iznini uygulama üzerinde vermiş olması gerekmektedir. Müşterinin kartların listelenmesine yönelik verdiği izin üye işyeri uygulamasında tutulmalıdır. getCards sorgusu müşterinin tanımlı kartını kullanarak yapacağı her işlem öncesinde çağrılmalıdır.
 */
module.exports.queryCards = function (req, res) {
  var data = {
    msisdn: req.body.msisdn,
    requestHeader: {
      applicationName,
      applicationPwd: applicationPassword,
      clientIPAddress: req.connection.remoteAddress,
      transactionDateTime: moment().format("YYYYMMDDHHmmssSSS"),
      transactionId: referenceNumberPrefix + moment().format("YYYYMMDDHHmmssSSS")
    }
  }
  devLogger("QueryCards SOAP request: " + JSON.stringify(data, null, 2))
  soap.createClient(soapUrl, function (error, client) {
    client.getCards(data, function (error, result) {
      if (error) {
        devLogger("Error: " + JSON.stringify(error, null, 2))
      } else {
        if (result.responseHeader && result.responseHeader.responseCode == 0) {
          //Response is successful
          devLogger("QueryCards SOAP response: " + JSON.stringify(result, null, 2))
          res.end(JSON.stringify(result))
        } else {
          res.end(JSON.stringify(result.responseHeader))
        }
      }
    })
  })
}