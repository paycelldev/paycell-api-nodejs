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
Üye işyeri ve Paycell arasında işlem mutabakatı yapılması amacıyla kullanılır. Üye işyeri kendisinde gözüken işlem adet ve tutarlarını iletir, servis cevabında Paycell’deki adet ve tutarlar dönülür, eşit olması durumunda mutabkat durumu OK olarak dönülür.
*/
module.exports.summaryReconciliation = function (req, res) {
  var transactionDateTime = moment().format('YYYYMMDDHHmmssSSS')
  var data = {
    merchantCode,
    reconciliationDate: req.body.reconciliationDate,
    requestHeader: {
      applicationName,
      applicationPwd: applicationPassword,
      clientIPAddress: req.connection.remoteAddress,
      transactionDateTime,
      transactionId: referenceNumberPrefix + transactionDateTime
    },
    totalRefundAmount: req.body.totalRefundAmount,
    totalRefundCount: req.body.totalRefundCount,
    totalReverseAmount: req.body.totalReverseAmount,
    totalReverseCount: req.body.totalReverseCount,
    totalSaleAmount: req.body.totalSaleAmount,
    totalSaleCount: req.body.totalSaleCount,

    totalPostAuthAmount: req.body.totalPostAuthAmount,
    totalPostAuthCount: req.body.totalPostAuthCount,
    totalPostAuthReverseAmount: req.body.totalPostAuthReverseAmount,
    totalPostAuthReverseCount: req.body.totalPostAuthReverseCount,
    totalPreAuthAmount: req.body.totalPreAuthAmount,
    totalPreAuthReverseAmount: req.body.totalPreAuthReverseAmount,
    totalPreAuthReverseCount: req.body.totalPreAuthReverseCount
  }
  devLogger("SummaryReconciliation REST request: " + JSON.stringify(data, null, 2))
  request.post(restUrl.summaryReconciliation, { json: data },
    function (error, response, body) {
      if (error) {
        devLogger("Error: " + JSON.stringify(error, null, 2))
        res.end(JSON.stringify(error))
      } else {
        devLogger("SummaryReconciliation REST response: " + JSON.stringify(body, null, 2))
        res.end(JSON.stringify(body))
      }
    })
}