const { applicationName, applicationPassword, referenceNumberPrefix, merchantCode, soapUrl } = require('../../Consts')

var moment = require('moment')
var soap = require('soap')
var devLogger = require('debug')('dev')


/*
Paycell’de tanımlı bir kart ile veya müşterinin kart numarası girerek gerçekleştireceği ödeme isteklerinin Paycell’e iletilmesi amacıyla kullanılır.
Ödeme alternatifleri ve serviste iletilecek cardId ve cardToken kullanımları aşağıdaki şekildeki gibidir.
Kayıtlı kart ile cvc girilmeden:
Sadece cardId gönderilir.
Kayıtlı kart ile cvc girilerek:
cardId ve sadece cvc’nin input olarak gönderildiği getCardToken servisi çağrılarak elde edilen cardToken parametreleri iletilir.
Kredi kartı numarası ve son kullanım tarihi girilerek:
Kart numarası ve son kullanım tarihi’nin input olarak gönderildiği getCardToken servisi çağrılarak elde edilen cardToken parametresi iletilir.
Kredi kartı numarası, son kullanım tarihi, cvc bilgisi girilerek:
Kart numarası, son kullanım tarihi ve cvc’nin input olarak gönderildiği getCardToken servisi çağrılarak elde edilen cardToken parametresi iletilir.
*/
module.exports.provision = function (req, res) {
  var transactionDateTime = moment().format("YYYYMMDDHHmmssSSS")
  var data = {
    requestHeader: {
      applicationName,
      applicationPwd: applicationPassword,
      clientIPAddress: req.connection.remoteAddress,
      transactionDateTime,
      transactionId: referenceNumberPrefix + transactionDateTime
    },
    merchantCode,
    referenceNumber: referenceNumberPrefix + transactionDateTime,
    msisdn: String(req.body.msisdn).substring(2),
    cardId: req.body.cardId,
    cardToken: req.body.cardToken,
    amount: req.body.amount,
    installmentCount: req.body.installmentCount,
    currency: req.body.currency,
    paymentType: req.body.paymentType,
    threeDSessionId: req.body.threeDSessionId
  }
  devLogger("Provision SOAP request: " + JSON.stringify(data, null, 2))
  soap.createClient(soapUrl, function (error, client) {
    client.provision(data, function (error, result) {
      if (error) {
        devLogger("Error: " + JSON.stringify(error, null, 2))
        res.end(JSON.stringify(error))
      } else {
        devLogger("Provision SOAP response: " + JSON.stringify(result, null, 2))
        res.end(JSON.stringify({
          responseHeader: result.responseHeader,
          referenceNumber: data.referenceNumber
        }))
      }
    })
  })
}