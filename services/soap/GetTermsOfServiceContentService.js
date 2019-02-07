const { merchantCode, referenceNumberPrefix, applicationName, applicationPassword, soapUrl } = require('../../Consts')

var moment = require('moment')
var soap = require('soap')
var devLogger = require('debug')('dev')

/*
Paycell’de tanımlı olan kartlar için mevcut sözleşme içeriğinin görüntülenmesini sağlayan servistir.
*/
module.exports.getTermsOfServiceContent = function (req, res) {
  var transactionDateTime = moment().format("YYYYMMDDHHmmssSSS")
  var data = {
    requestHeader: {
      applicationName,
      applicationPwd: applicationPassword,
      clientIPAddress: req.connection.remoteAddress,
      transactionDateTime,
      transactionId: referenceNumberPrefix + transactionDateTime
    }
  }
  devLogger("getTermsOfServiceContent SOAP request: " + JSON.stringify(data, null, 2))
  soap.createClient(soapUrl, function (error, client) {
    client.getTermsOfServiceContent(data, function (error, result) {
      if (error) {
        devLogger("Error: " + JSON.stringify(error, null, 2))
        res.end(JSON.stringify(error))
      } else {
        devLogger("getTermsOfServiceContent SOAP response: " + JSON.stringify(result, null, 2))
        res.end(JSON.stringify(result))
      }
    })
  })
}