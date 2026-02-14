const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Admin dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const products = await Product.countDocuments();
    const orders = await Order.countDocuments();
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    res.json({ users, products, orders, recentOrders });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getDashboardStats };
