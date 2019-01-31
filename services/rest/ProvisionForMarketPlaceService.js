const {
  applicationName,
  applicationPassword,
  merchantCode,
  referenceNumberPrefix,
  restUrl
} = require('../../Consts')

var moment = require('moment')
var request = require('request')
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
    cardId: req.body.cardId,
    currency: req.body.currency,
    msisdn: String(req.body.msisdn).substring(2),
    paymentType: req.body.paymentType,
    referenceNumber: referenceNumberPrefix + transactionDateTime
  }
  devLogger("ProvisionForMarketPlace REST request: " + JSON.stringify(data, null, 2))
  request.post(restUrl.provisionForMarketPlace, { json: data },
    function (error, response, body) {
      if (error) {
        devLogger("Error: " + JSON.stringify(error, null, 2))
        res.end(JSON.stringify(error))
      } else {
        devLogger("ProvisionForMarketPlace REST response: " + JSON.stringify(body, null, 2))
        res.end(JSON.stringify({
          responseHeader: body.responseHeader,
          referenceNumber: data.referenceNumber
        }))
      }
    })
}