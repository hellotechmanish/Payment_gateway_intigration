const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentcontroler');

// Route to initiate a payment
router.post('/initiate', paymentController.initiatePayment);

// Route to handle Paytm callback
router.post('/callback', paymentController.paymentCallback);

module.exports = router;
