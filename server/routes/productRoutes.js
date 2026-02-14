const express = require("express");
const router = express.Router();

const upload = require("../utils/multer");
const { createProduct, getAllProducts, getProductById, updateProductById, deleteProductById, getProductsByCategory, searchProducts, getFeaturedProducts } = require("../controllers/productController");
const { authMiddleware, roleMiddleware } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, roleMiddleware("admin"), (req, res, next) => {
    upload.single("image")(req, res, function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, createProduct);

router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    upload.single("image"), 
    updateProductById
); 
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteProductById);
router.get("/category/:slug", getProductsByCategory);

module.exports = router;