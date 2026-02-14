const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getUserProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        next(error);
    }
}

const updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { name, email, password } = req.body;

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        const updatedUserProfile = await user.save();

        const userToReturn = updatedUserProfile.toObject();
        delete userToReturn.password;

        res.status(200).json({
            success: true,
            user: userToReturn
        });

    } catch (error) {
        next(error);
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await User.find({}).select("-password");

        res.status(200).json({
            success: true,
            allUsers
        });

    } catch (error) {
        next(error);
    }
}

const getUserById = async (req, res, next) => {
    try {
        const id = req.params.id;

        const user = await User.findById(id).select("-password")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
}

const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { name, email, password, role } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        const allowedRoles = ["user", "admin"];
        if (role && allowedRoles.includes(role)) {
            user.role = role;
        }


        const updatedUserProfile = await user.save();

        const userToReturn = updatedUserProfile.toObject();
        delete userToReturn.password;

        res.status(200).json({
            success: true,
            user: userToReturn
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { getUserProfile, updateUserProfile, getAllUsers, getUserById, updateUser }