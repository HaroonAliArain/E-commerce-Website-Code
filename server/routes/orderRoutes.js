const express = require("express");
const { createOrder, getOrderById, myOrders, getAllOrders, updateStatus, payOrder, deleteOrder, cancelOrder } = require("../controllers/orderController");
const { authMiddleware, roleMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/myorders", authMiddleware, myOrders);
router.get("/allorders", authMiddleware, roleMiddleware("admin"), getAllOrders);
router.put("/:id/status", authMiddleware, roleMiddleware("admin"), updateStatus);
router.put("/:id/pay", authMiddleware, payOrder);
router.delete("/:id/cancel", authMiddleware, cancelOrder);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteOrder);
router.get("/:id", authMiddleware, getOrderById);

module.exports = router;