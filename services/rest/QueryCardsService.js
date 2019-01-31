var moment = require('moment')
var request = require('request')
var devLogger = require('debug')('dev')

var { applicationName, applicationPassword, restUrl, referenceNumberPrefix } = require('../../Consts')

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
  devLogger("QueryCards REST request: " + JSON.stringify(data, null, 2))
  request.post(restUrl.getCards, { json: data },
    function (error, response, body) {
      if (error) {
        devLogger("Error: " + JSON.stringify(error, null, 2))
      } else {
        if (body.responseHeader && body.responseHeader.responseCode == 0) {
          //Response is successful
          var responseText = JSON.stringify(body, null, 2)
          devLogger("QueryCards REST response: " + responseText)
          res.end(responseText)
        } else {
          res.end(JSON.stringify(
            body.responseHeader, null, 2
          ))
        }
      }
    })
}