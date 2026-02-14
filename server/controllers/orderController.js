const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail")
const renderTemplate = require("../utils/renderTemplate");

const createOrder = async (req, res, next) => {
    try {
        const { orderItems, shippingAddress, paymentMethod } = req.body;

        if (!orderItems || orderItems.length == 0) {
            return res.status(400).json({ message: "No order item found" });
        }

        const totalPrice = orderItems.reduce((acc, item) => {
            return acc + item.price * item.quantity;
        }, 0);

        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            orderStatus: "Pending",
            isPaid: false
        });

        const createOrder = await order.save();

        try {
            const email = String(req.user.email || "").trim();


            if (!email) {
                console.error("User email missing, email not sent");
            } else {
                const html = await renderTemplate("orderConfirmation.ejs", {
                    orderId: createOrder._id,
                    totalPrice: createOrder.totalPrice,
                    orderStatus: createOrder.orderStatus
                });
                await sendEmail(
                    email,
                    "Order Placed Successfully",
                    html
                );
            }
        } catch (err) {
            console.error("Email sending failed:", err);
        }


        res.status(201).json({
            success: "Order Created successfully",
            order: createOrder
        });
    } catch (error) {
        next(error);
    }
}

const getOrderById = async (req, res, next) => {
    try {
        const orderId = req.params.id;

        const order = await Order.findById(orderId)
            .populate("user", "name email")
            .populate("orderItems.product", "name price");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        if (req.user.role !== "admin" && order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view this order",
            });
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
};

const myOrders = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ user: userId })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        next(error);
    }
}

const getAllOrders = async (req, res, next) => {
    try {
        const allOrders = await Order.find({})
            .populate("user", "name email")
            .sort({ createdAt: -1 });


        res.status(200).json({
            success: true,
            allOrders
        })
    } catch (error) {
        next(error);
    }
}

const updateStatus = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { orderStatus } = req.body;

        const order = await Order.findById(id).populate("user", "name email");
        if (!order) {
            return res.status(400).json({
                success: false,
                message: "Order not found"
            });
        }

        order.orderStatus = orderStatus;

        if (orderStatus.toLowerCase() === "delivered") {
            order.isPaid = true;
            order.deliveredAt = new Date();
        }

        if (orderStatus.toLowerCase() === "cancelled" && order.paymentStatus === "Paid") {
            console.log("Payment refunded.");
        }

        const updatedOrder = await order.save();

        // populate user again before sending
        await updatedOrder.populate("user", "name email");

        res.status(200).json({
            success: true,
            order: updatedOrder
        });

    } catch (error) {
        next(error);
    }
};


const payOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const { paymentIntent } = req.body;

        order.isPaid = true;
        order.paidAt = Date.now();
        order.orderStatus = "Paid";

        order.paymentResult = {
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
        };

        const updatedOrder = await order.save();

        res.status(200).json({
            success: true,
            message: "Order paid successfully",
            order: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Delete Order (Admin only)
const deleteOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        await Order.findByIdAndDelete(orderId);

        res.status(200).json({
            success: true,
            message: "Order deleted successfully",
            deletedOrderId: orderId
        });
    } catch (error) {
        next(error);
    }
};



// Cancel Order (User can cancel their own unpaid orders)
const cancelOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const userId = req.user._id;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if the user owns this order
        if (order.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to cancel this order"
            });
        }

        // Only allow cancellation of unpaid orders
        if (order.isPaid) {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel a paid order"
            });
        }

        // Delete the order
        await Order.findByIdAndDelete(orderId);

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            cancelledOrderId: orderId
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { createOrder, getOrderById, myOrders, getAllOrders, updateStatus, payOrder, deleteOrder, cancelOrder };

