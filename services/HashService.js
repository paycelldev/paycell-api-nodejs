const { applicationName, applicationPassword, secureCode } = require("../Consts")

var crypto = require("crypto")

/*
PAYCELL tarafından iletilecek applicationPwd ve secureCode ile input parametreleri hash'lenir.
Hash data oluşturulmasında kullanılacak olan güvenlik parametreleri (applicationName, applicationPwd, secureCode) server tarafında tutulmalıdır, hash oluşturma işlemi server tarafında yapılmalıdır, ancak oluşan değerler uygulama/client tarafında iletilerek getCardToken servisi uygulama/client tarafından çağrılmalıdır.
hashData 2 aşamada oluşturulacaktır.
Her iki aşamada da ilgili parametreler büyük harfe dönüştürülerek data oluşturulmalıdır.
İlk aşamada securityData hashlenerek oluşturulur. securityData oluşturulurken applicationName ve applicationPwd değeri büyük harfe çevrilir. Oluşan securityData değeri ikinci aşamadaki hashData üretiminde kullanılmak üzere büyük harfe dönüştürülür.
İkinci aşamada, oluşturulan securityData ile diğer değerler büyük harfe çevrilerek birleştirilip elde edilen değer hashlenerek hashData oluşturulur.

securityData: applicationPwd+ applicationName
hashData: applicationName+ transactionId+ transactionDateTime+ secureCode + securityData
 */
module.exports.hashRequest = function (req, res) {
  var securityData = sha256(applicationPassword.toUpperCase()
    + applicationName.toUpperCase())
  var hashData = sha256(applicationName.toUpperCase()
    + req.body.transactionId.toUpperCase()
    + req.body.transactionDateTime.toUpperCase()
    + secureCode.toUpperCase()
    + securityData.toUpperCase())
  res.end(hashData);
}

/*
responseBody'de dönülen hashData ile üye işyerinin oluşturacağı hashData eşit olmalıdır. Bu kontrol üye işyeri tarafından yapılır.
Üye işyerinin oluşturacağı hashData 2 aşamada oluşturulacaktır. İlk aşamada securityData hashlenerek oluşturulur. İkinci aşamada oluşturulan securityData ile diğer değerler birleştirilerek elde edilen değer hashlenerek hashData oluşturulur.
securityData: applicationPwd+ applicationName

hashData: applicationName+ transactionId+ responseDateTime + responseCode + cardToken + secureCode + securityData
*/
module.exports.hashResponse = function (req, res) {
  var securityData = sha256(
    applicationPassword.toUpperCase()
    + applicationName.toUpperCase()
  )
  var hashData = sha256(
    applicationName.toUpperCase()
    + req.body.transactionId.toUpperCase()
    + req.body.responseDateTime.toUpperCase()
    + req.body.responseCode.toUpperCase()
    + req.body.cardToken.toUpperCase()
    + secureCode.toUpperCase()
    + securityData.toUpperCase()
  )
  res.end(hashData)
}

var sha256 = function (text) {
  return crypto.createHash("sha256").update(text).digest("base64")
}