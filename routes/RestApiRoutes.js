var { queryCards } = require('../services/rest/QueryCardsService')
var { registerCard } = require('../services/rest/RegisterCardService')
var { deleteCard } = require('../services/rest/DeleteCardService')
var { updateCard } = require('../services/rest/UpdateCardService')
var { getThreeDSession, getThreeDSessionResult } = require('../services/rest/ThreeDSecureService')
var { provision } = require('../services/rest/ProvisionService')
var { inquire } = require('../services/rest/InquireService')
var { provisionForMarketPlace } = require('../services/rest/ProvisionForMarketPlaceService')
var { refund } = require('../services/rest/RefundService')
var { reverse } = require('../services/rest/ReverseService')
var { summaryReconciliation } = require('../services/rest/SummaryReconciliationService')
var { getProvisionHistory } = require('../services/rest/ProvisionHistoryService')
var { getTermsOfServiceContent } = require('../services/rest/GetTermsOfServiceContentService')

module.exports = function (app) {
  app.route("/api/rest/queryCards")
    .post(queryCards);
  app.route("/api/rest/registerCard")
    .post(registerCard)
  app.route("/api/rest/deleteCard")
    .post(deleteCard)
  app.route("/api/rest/updateCard")
    .post(updateCard)
  app.route("/api/rest/getThreeDSession")
    .post(getThreeDSession)
  app.route("/api/rest/getThreeDSessionResult")
    .post(getThreeDSessionResult)
  app.route("/api/rest/provision")
    .post(provision)
  app.route("/api/rest/provisionForMarketPlace")
    .post(provisionForMarketPlace)
  app.route("/api/rest/inquire")
    .post(inquire)
  app.route("/api/rest/refund")
    .post(refund)
  app.route("/api/rest/reverse")
    .post(reverse)
  app.route("/api/rest/summaryReconciliation")
    .post(summaryReconciliation)
  app.route("/api/rest/getProvisionHistory")
    .post(getProvisionHistory)
  app.route("/api/rest/getTermsOfServiceContent")
    .post(getTermsOfServiceContent)
}