const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected Successfully.");
    } catch (error) {
        console.log("Connection Lossed.");
        console.error(error.message);
    }
}

module.exports = connectDB;