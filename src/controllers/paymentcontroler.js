const PaytmChecksum = require('paytmchecksum');
const https = require('https');

// Paytm credentials
const config = {
    MID: 'YOUR_MID',
    PAYTM_MERCHANT_KEY: 'YOUR_MERCHANT_KEY',
    WEBSITE: 'WEBSTAGING', // Use 'WEBSTAGING' for testing and 'DEFAULT' for production
    INDUSTRY_TYPE_ID: 'Retail',
    CHANNEL_ID: 'WEB',
    CALLBACK_URL: 'http://localhost:3000/payment/callback', // Update with your callback URL
};

// Initiate Payment
exports.initiatePayment = async (req, res) => {
    const { orderId, amount, customerId } = req.body;

    const paytmParams = {
        MID: config.MID,
        WEBSITE: config.WEBSITE,
        INDUSTRY_TYPE_ID: config.INDUSTRY_TYPE_ID,
        CHANNEL_ID: config.CHANNEL_ID,
        ORDER_ID: orderId,
        CUST_ID: customerId,
        TXN_AMOUNT: amount,
        CALLBACK_URL: config.CALLBACK_URL,
    };

    // Generate checksum
    const checksum = await PaytmChecksum.generateSignature(paytmParams, config.PAYTM_MERCHANT_KEY);

    paytmParams.CHECKSUMHASH = checksum;

    res.status(200).json({
        status: 'success',
        data: paytmParams,
    });
};

// Handle Callback
exports.paymentCallback = async (req, res) => {
    const receivedData = req.body;

    const paytmChecksum = receivedData.CHECKSUMHASH;
    delete receivedData.CHECKSUMHASH;

    const isValidChecksum = PaytmChecksum.verifySignature(receivedData, config.PAYTM_MERCHANT_KEY, paytmChecksum);

    if (isValidChecksum) {
        console.log('Checksum Matched');

        // Verify transaction status with Paytm server
        const params = {
            MID: config.MID,
            ORDERID: receivedData.ORDERID,
        };

        const checksum = await PaytmChecksum.generateSignature(params, config.PAYTM_MERCHANT_KEY);

        params.CHECKSUMHASH = checksum;

        const postData = JSON.stringify(params);

        const options = {
            hostname: 'securegw-stage.paytm.in', // Use 'securegw.paytm.in' for production
            port: 443,
            path: '/order/status',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length,
            },
        };

        const response = [];
        const request = https.request(options, (res) => {
            res.on('data', (chunk) => {
                response.push(chunk);
            });

            res.on('end', () => {
                const responseBody = Buffer.concat(response).toString();
                const result = JSON.parse(responseBody);

                if (result.STATUS === 'TXN_SUCCESS') {
                    res.status(200).json({
                        status: 'success',
                        message: 'Payment Successful',
                        data: result,
                    });
                } else {
                    res.status(400).json({
                        status: 'failure',
                        message: 'Payment Failed',
                        data: result,
                    });
                }
            });
        });

        request.on('error', (error) => {
            console.error(error);
            res.status(500).json({
                status: 'error',
                message: 'Server Error',
            });
        });

        request.write(postData);
        request.end();
    } else {
        res.status(400).json({
            status: 'failure',
            message: 'Checksum Mismatch',
        });
    }
};
