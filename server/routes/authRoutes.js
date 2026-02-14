const express = require("express");
const router = express.Router();
const { createAdmin, registerUser, loginUser } = require("../controllers/authController");
const { authMiddleware, roleMiddleware } = require("../middlewares/authMiddleware");

router.post("/create-admin", authMiddleware, roleMiddleware("admin"), createAdmin);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
