const express = require("express");
const { getUserProfile, updateUserProfile, getAllUsers, getUserById, updateUser } = require("../controllers/userController");
const { authMiddleware, roleMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);
router.put("/editprofile", authMiddleware, updateUserProfile);
router.get("/", authMiddleware, roleMiddleware("admin"), getAllUsers);
router.get("/:id", authMiddleware, roleMiddleware("admin"), getUserById);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateUser);

module.exports = router;
