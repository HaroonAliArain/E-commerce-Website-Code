const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderItems: [{
        product: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
        name: {type: String, required: true},
        image: {type: String},
        price: {type: Number, required: true},
        quantity: {type: Number, required: true}
    }],
    shippingAddress: {
        address: {type: String, required: true},
        city: {type: String, required: true},
        postalCode: {type: String, required: true},
        country: {type: String, required: true},
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["Stripe", "Cash payment"]
    },
    paymentResult: {
        id: { type: String },          
        status: { type: String },      
        amount: { type: Number },      
        currency: { type: String },    
    },
    taxPrice: {
        type: Number,
        default: 0
    },
    shippingPrice: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        required: true
    },
    orderStatus: { 
        type: String, 
        required: true, 
        default: "Pending" 
    },

    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: {
        type: Date
    }
}, {timestamps: true});

module.exports = mongoose.model("Order", orderSchema);