const Category = require("../models/Category");
const Product = require("../models/Product");

const slugify = require("slugify");

const createCategory = async (req, res) => {
    try {
        const { name, description, isFeatured } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const existCategory = await Category.findOne({ name });
        if (existCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const category = new Category({
            name, description, isFeatured
        });
        await category.save()

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

const getAllCategories = async (req, res) => {
    try {
        const filter = req.query.isFeatured ? { isFeatured: true } : {};
        const categories = await Category.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "All categories",
            categories
        })

    } catch (error) {
        next(error)
    }
}

const getCategoryBySlug = async (req, res, next) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            category
        })
    } catch (error) {
        next(error)
    }
}

const updateCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, isFeatured } = req.body;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        if (name) {
            category.name = name;
            category.slug = slugify(name, { lower: true, strict: true }); 
        }
        if (description) category.description = description;
        if (isFeatured !== undefined) category.isFeatured = isFeatured;

        const updatedCategory = await category.save();

        res.status(200).json({
            success: true,
            updatedCategory
        });
    } catch (error) {
        next(error);
    }
}

const deleteCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        const linkedProducts = await Product.find({ category: id });
        if (linkedProducts.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete category with products. Delete or reassign products first."
            });
        }

        await Category.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { createCategory, getAllCategories, getCategoryBySlug, updateCategoryById, deleteCategoryById }