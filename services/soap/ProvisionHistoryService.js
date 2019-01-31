const {
  applicationName,
  applicationPassword,
  merchantCode,
  referenceNumberPrefix,
  soapUrl
} = require('../../Consts')

var momoent = require('moment')
var soap = require('soap')
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
  devLogger("GetProvisionHistory SOAP request: " + JSON.stringify(data, null, 2))
  soap.createClient(soapUrl, function (error, client) {
    client.getProvisionHistory(data, function (error, result) {
      if (error) {
        devLogger("Error: " + JSON.stringify(error, null, 2))
        res.end(JSON.stringify(error))
        return;
      }
      devLogger("GetProvisionHistory SOAP response: " + JSON.stringify(result, null, 2))
      if (result.transactionList) {
        transactionList.push(...result.transactionList)
      }
      if (result.nextPartitionNo) {
        getProvisionHistoryInner(req, res, result.nextPartitionNo, transactionList)
      } else {
        res.end(JSON.stringify({
          responseHeader: result.responseHeader,
          transactionList
        }))
      }
    })
  })
}