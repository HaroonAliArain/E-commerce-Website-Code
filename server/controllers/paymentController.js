const Stripe = require("stripe");
const Order = require("../models/Order");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Stripe expects amount in cents
    const amount = Math.round(order.totalPrice * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ THIS IS WHERE YOUR CODE GOES
    order.isPaid = true;
    order.paidAt = Date.now();
    order.orderStatus = "Paid";

    order.paymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      updateTime: new Date(),
      email: paymentIntent.receipt_email || "",
    };

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "Payment successful & order updated",
      order: updatedOrder,
    });

  } catch (error) {
    console.error("Confirm Payment Error:", error);
    res.status(500).json({ message: "Payment confirmation failed" });
  }
};


module.exports = { createPaymentIntent, confirmPayment };