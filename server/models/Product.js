const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    image: {
        type: String,
        default: "https://graphicdesigneye.com/images/group-bundle-shots.jpg"
    },
    stock: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    reviews: [{ 
        user: String, 
        comment: String, 
        rating: Number 
    }], 
    isFeatured: { 
        type: Boolean, 
        default: false 
    }
}, {timestamps: true});

module.exports = mongoose.model("Product", productSchema);