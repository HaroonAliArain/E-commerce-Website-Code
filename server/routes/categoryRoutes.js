const express = require("express");
const router = express.Router();

const { createCategory, getAllCategories, getCategoryBySlug, updateCategoryById, deleteCategoryById } = require("../controllers/categoryController");
const { authMiddleware, roleMiddleware } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, roleMiddleware("admin"), createCategory);
router.get("/all", getAllCategories);
router.get("/:slug", getCategoryBySlug);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateCategoryById);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteCategoryById);

module.exports = router;