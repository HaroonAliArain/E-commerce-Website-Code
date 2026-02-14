const express = require("express");
const router = express.Router();
const { createPaymentIntent, confirmPayment } = require("../controllers/paymentController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/create-payment-intent", authMiddleware,createPaymentIntent);
router.post("/confirm", authMiddleware, confirmPayment);


module.exports = router;
