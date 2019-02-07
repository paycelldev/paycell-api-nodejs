var { queryCards } = require('../services/soap/QueryCardsService')
var { updateCard } = require('../services/soap/UpdateCardService')
var { deleteCard } = require('../services/soap/DeleteCardService')
var { registerCard } = require('../services/soap/RegisterCardService')
var { provision } = require('../services/soap/ProvisionService')
var { provisionForMarketPlace } = require('../services/soap/ProvisionForMarketPlaceService')
var { inquire } = require('../services/soap/InquireService')
var { reverse } = require('../services/soap/ReverseService')
var { refund } = require('../services/soap/RefundService')
var { getProvisionHistory } = require('../services/soap/ProvisionHistoryService')
var { summaryReconciliation } = require('../services/soap/SummaryReconciliationService')
var { getThreeDSession, getThreeDSessionResult } = require('../services/soap/ThreeDSecureService')
var { getTermsOfServiceContent } = require('../services/soap/GetTermsOfServiceContentService')

module.exports = function (app) {
  app.route("/api/soap/queryCards")
    .post(queryCards);
  app.route("/api/soap/updateCard")
    .post(updateCard);
  app.route("/api/soap/deleteCard")
    .post(deleteCard);
  app.route("/api/soap/registerCard")
    .post(registerCard);
  app.route("/api/soap/provision")
    .post(provision);
  app.route("/api/soap/provisionForMarketPlace")
    .post(provisionForMarketPlace);
  app.route("/api/soap/inquire")
    .post(inquire);
  app.route("/api/soap/reverse")
    .post(reverse);
  app.route("/api/soap/refund")
    .post(refund);
  app.route("/api/soap/getProvisionHistory")
    .post(getProvisionHistory);
  app.route("/api/soap/summaryReconciliation")
    .post(summaryReconciliation);
  app.route("/api/soap/getThreeDSession")
    .post(getThreeDSession);
  app.route("/api/soap/getThreeDSessionResult")
    .post(getThreeDSessionResult);
  app.route("/api/soap/getTermsOfServiceContent")
    .post(getTermsOfServiceContent)
}