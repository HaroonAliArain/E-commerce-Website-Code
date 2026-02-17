const express = require("express");
const router = express.Router();
const { createAdmin, registerUser, loginUser, verifyOTP } = require("../controllers/authController");
const { authMiddleware, roleMiddleware } = require("../middlewares/authMiddleware");

router.post("/create-admin", authMiddleware, roleMiddleware("admin"), createAdmin);
router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);

module.exports = router;

