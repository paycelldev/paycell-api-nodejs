const { merchantCode, referenceNumberPrefix, applicationName, applicationPassword, restUrl } = require('../../Consts')

var moment = require('moment')
var request = require('request')
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
  devLogger("getTermsOfServiceContent REST request: " + JSON.stringify(data, null, 2))
  request.post(restUrl.getTermsOfServiceContent, { json: data },
    function (error, response, body) {
      if (error) {
        devLogger("Error: " + JSON.stringify(error, null, 2))
        res.end(JSON.stringify(error))
      } else {
        devLogger("getTermsOfServiceContent REST response: " + JSON.stringify(body, null, 2))
        res.end(JSON.stringify(body))
      }
    })
}