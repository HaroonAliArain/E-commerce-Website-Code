const Product = require("../models/Product");
const Category = require("../models/Category");
const cloudinary = require("../utils/cloudinary");

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, isFeatured } = req.body;
        if (!name || !description || !price || !category) {
            res.status(400);
            throw new Error("fill all the details of product");
        }

        const categoryExist = await Category.findById(category)
        if (!categoryExist) {
            res.status(404);
            throw new Error("Category not found");
        }

        const image = req.file?.path;
        const public_id = req.file?.filename;

        const product = await Product.create({
            name, description, price, category, image, public_id, stock, isFeatured
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(res.statusCode || 500);
        throw error;
    }
}

const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find()
            .populate("category", "name slug");

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id).populate("category", "name slug");
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            product
        })

    } catch (error) {
        next(error);
    }
}

const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, category, isFeatured } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (name) product.name = name;
    if (price) product.price = Number(price);
    if (stock) product.stock = Number(stock);
    if (category) product.category = category;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;

    // handle image if uploaded
    if (req.file) {
      product.image = req.file.path;
      product.public_id = req.file.filename;
    }

    await product.save();
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const deleteProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (product.public_id) {
            await cloudinary.uploader.destroy(product.public_id);
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            product
        });

    } catch (error) {
        next(error);
    }
};

const getProductsByCategory = async (req, res, next) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        const products = await Product.find({ category: category._id })
            .populate("category", "name slug");

        res.status(200).json({
            success: true,
            category: category.name,
            products
        });

    } catch (error) {
        next(error);
    }
};

const searchProducts = async (req, res, next) => {
    try {
        const keyword = req.query.keyword ? req.query.keyword : "";

        const products = await Product.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).populate("category", "name slug");

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        next(error);
    }
}

const getFeaturedProducts = async (req, res, next) => {
    try {
        // Optional: limit number of featured products
        const limit = req.query.limit ? parseInt(req.query.limit) : 5;

        const products = await Product.find({ isFeatured: true })
            .populate("category", "name slug")
            .limit(limit);

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        next(error);
    }
};



module.exports = { createProduct, getAllProducts, getProductById, updateProductById, deleteProductById, getProductsByCategory, searchProducts, getFeaturedProducts }