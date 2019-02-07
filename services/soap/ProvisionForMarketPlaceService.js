const {
  applicationName,
  applicationPassword,
  merchantCode,
  referenceNumberPrefix,
  soapUrl
} = require('../../Consts')

var moment = require('moment')
var soap = require('soap')
var devLogger = require('debug')('dev')

/*
Üye işyerinin pazaryeri kurgusu (birden fazla altüye işyerine ödeme yapabilmesi) amacıyla kullanılır.
*/
module.exports.provisionForMarketPlace = function (req, res) {
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
    amount: req.body.amount,
    installmentCount: req.body.installmentCount,
    cardId: req.body.cardId,
    currency: req.body.currency,
    msisdn: String(req.body.msisdn).substring(2),
    paymentType: req.body.paymentType,
    referenceNumber: referenceNumberPrefix + transactionDateTime
  }
  devLogger("ProvisionForMarketPlace SOAP request: " + JSON.stringify(data, null, 2))
  soap.createClient(soapUrl, function (error, client) {
    client.provisionForMarketPlace(data, function (error, result) {
      if (error) {
        devLogger("Error: " + JSON.stringify(error, null, 2))
        res.end(JSON.stringify(error))
      } else {
        devLogger("ProvisionForMarketPlace SOAP response: " + JSON.stringify(result, null, 2))
        res.end(JSON.stringify({
          responseHeader: result.responseHeader,
          referenceNumber: data.referenceNumber
        }))
      }
    })
  })
}