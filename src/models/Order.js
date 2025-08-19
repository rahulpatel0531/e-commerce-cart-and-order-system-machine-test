const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        items: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            qty: {
                type: Number
            },
            Price: {
                type: Number
            }
        }],
        total: Number,
        discount: Number,
        finalAmount: Number,
        promoCode: String,
        status: {
            type: String,
            enum: ["created", "paid", "shipped", "cancelled"],
            default: "created"
        },
        meta: { type: Object, default: {} }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Order', OrderSchema)