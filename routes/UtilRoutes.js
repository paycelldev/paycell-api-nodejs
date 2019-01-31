var {hashRequest, hashResponse} = require("../services/HashService")

module.exports = function (app) {
  app.route("/api/hashRequest")
    .post(hashRequest);
  app.route("/api/hashResponse")
    .post(hashResponse)
}