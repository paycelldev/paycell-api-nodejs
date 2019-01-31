const {
  applicationName,
  applicationPassword,
  merchantCode,
  referenceNumberPrefix,
  restUrl
} = require('../../Consts')

var momoent = require('moment')
var request = require('request')
var devLogger = require('debug')('dev')

/*
Geçmiş işlem detaylarını sorgulamak için kullanılacak servistir.
*/
module.exports.getProvisionHistory = function (req, res) {
  getProvisionHistoryInner(req, res, 0, [])
}

var getProvisionHistoryInner = function (req, res, partitionNo, transactionList) {
  var transactionDateTime = momoent().format('YYYYMMDDHHmmssSSS')
  var data = {
    requestHeader: {
      applicationName,
      applicationPwd: applicationPassword,
      clientIPAddress: req.connection.remoteAddress,
      transactionDateTime,
      transactionId: referenceNumberPrefix + transactionDateTime
    },
    merchantCode,
    partitionNo,
    reconciliationDate: req.body.reconciliationDate
  }
  devLogger("GetProvisionHistory REST request: " + JSON.stringify(data, null, 2))
  request.post(restUrl.getProvisionHistory, { json: data },
    function (error, response, body) {
      if (error) {
        devLogger("Error: " + JSON.stringify(error, null, 2))
        res.end(JSON.stringify(error))
        return;
      }
      devLogger("GetProvisionHistory REST response: " + JSON.stringify(body, null, 2))
      if (body.transactionList) {
        transactionList.push(...body.transactionList)
      }
      if (body.nextPartitionNo) {
        getProvisionHistoryInner(req, res, body.nextPartitionNo, transactionList)
      } else {
        res.end(JSON.stringify({
          responseHeader: body.responseHeader,
          transactionList
        }))
      }
    })
}