/* import checksum generation utility */
const PaytmChecksum = require("./PaytmChecksum");

/* string we need to verify against checksum */

var body = "{/*YOUR_COMPLETE_REQUEST_BODY_HERE*/}";
/*For Example: {"\mid\":"\YOUR_MID_HERE\","\orderId\":"\YOUR_ORDER_ID_HERE\"}*/

/* checksum that we need to verify */
var paytmChecksum = "CHECKSUM_VALUE";

var isVerifySignature = PaytmChecksum.verifySignature(body, config.PAYTM_MERCHANT_KEY, paytmChecksum);
if (isVerifySignature) {
    console.log("Checksum Matched");
} else {
    console.log("Checksum Mismatched");
}