module.exports.applicationName = "PAYCELLTEST"
module.exports.applicationPassword = "PaycellTestPassword"
module.exports.secureCode = "PAYCELL12345"
module.exports.eulaId = "17"
module.exports.merchantCode = "9998"
module.exports.referenceNumberPrefix = "001"

module.exports.soapUrl = "https://tpay-test.turkcell.com.tr/tpay/provision/services/ws?wsdl"

//rest urls
module.exports.restUrl = {
  getCards: "https://tpay-test.turkcell.com.tr/tpay/provision/services/restful/getCardToken/getCards/",
  registerCard: "https://tpay-test.turkcell.com.tr/tpay/provision/services/restful/getCardToken/registerCard/",
  updateCard: "https://tpay-test.turkcell.com.tr/tpay/provision/services/restful/getCardToken/updateCard/",
  deleteCard: "https://tpay-test.turkcell.com.tr/tpay/provision/services/restful/getCardToken/deleteCard/",
  provision: "https://tpay-test.turkcell.com.tr/tpay/provision/services/restful/getCardToken/provision/",
  inquire: "https://tpay-test.turkcell.com.tr/tpay/provision/services/restful/getCardToken/inquire/",
  reverse: "https://tpay-test.turkcell.com.tr/tpay/provision/services/restful/getCardToken/reverse/",
  refund: "https://tpay-test.turkcell.com.tr/tpay/provision/services/restful/getCardToken/refund/",
  summaryReconciliation: "https://tpay-test.turkcell.com.tr/tpay/provision/services/restful/getCardToken/summaryReconciliation/",
  getThreeDSession: "https://tpay-test.turkcell.com.tr/tpay/provision/services/restful/getCardToken/getThreeDSession/",
  getThreeDSessionResult: "https://tpay-test.turkcell.com.tr/tpay/provision/services/restful/getCardToken/getThreeDSessionResult/",
  getProvisionHistory: "https://tpay-test.turkcell.com.tr/tpay/provision/services/restful/getCardToken/getProvisionHistory",
  provisionForMarketPlace: "https://tpay-test.turkcell.com.tr/tpay/provision/services/restful/getCardToken/provisionForMarketPlace/",
}