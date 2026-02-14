const express = require("express");
const { getDashboardStats } = require("../controllers/adminController");
const { authMiddleware, roleMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// Dashboard stats
router.get("/dashboard", authMiddleware, roleMiddleware("admin"), getDashboardStats);

module.exports = router;
