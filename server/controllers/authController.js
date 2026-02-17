const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const renderTemplate = require("../utils/renderTemplate");

// Helper: Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all fields." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const adminUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin",
            isVerified: true
        });

        res.status(201).json({
            _id: adminUser._id,
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill the fields." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // If user exists but is not verified and OTP expired, delete and allow re-register
            if (!existingUser.isVerified && existingUser.otpExpires < Date.now()) {
                await User.findByIdAndDelete(existingUser._id);
            } else {
                return res.status(400).json({ message: "User already exists." });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user',
            isVerified: false,
            otp,
            otpExpires
        });

        // Send OTP verification email
        try {
            const html = await renderTemplate("otpVerification.ejs", { name: user.name, otp });
            await sendEmail(
                user.email,
                "Verify Your Email - E-Commerce App",
                html
            );
        } catch (emailError) {
            console.error("OTP email sending failed:", emailError.message);
        }

        res.status(201).json({
            message: "OTP sent to your email. Please verify to complete registration.",
            email: user.email
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required." });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found. Please register again." });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Email is already verified. Please login." });
        }

        // Check if OTP has expired
        if (user.otpExpires < Date.now()) {
            await User.findByIdAndDelete(user._id);
            return res.status(400).json({ message: "OTP has expired. Please register again." });
        }

        // Check if OTP matches
        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP. Please try again." });
        }

        // Mark as verified and clear OTP fields
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Send welcome email
        try {
            const html = await renderTemplate("welcome.ejs", { name: user.name });
            await sendEmail(
                user.email,
                "Welcome to E-Commerce App!",
                html
            );
        } catch (emailError) {
            console.error("Welcome email sending failed:", emailError.message);
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        // Block login for unverified users
        if (!existingUser.isVerified) {
            return res.status(400).json({ message: "Please verify your email first." })
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
}

module.exports = { createAdmin, registerUser, loginUser, verifyOTP };
