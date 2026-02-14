const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const upload = require("./utils/multer");
const cloudinary = require("./utils/cloudinary");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const UserRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const errorMiddleware = require("./middlewares/errorMiddleware");
const transporter = require("./config/email");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://e-commerce-website-code-ogrz.vercel.app"
  ],
  credentials: true
}));


connectDB();      // Connection with DB

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce API");
});

app.use(errorMiddleware);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running to the port: ${PORT}`);
  });
}

module.exports = app;
