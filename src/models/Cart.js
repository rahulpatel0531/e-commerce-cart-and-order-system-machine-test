const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        tempId: {
            type: String,
            default: null
        },
        items: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            qty: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true,
            },
        }]
    },
    {
        timestamps: true
    }
);

CartSchema.index({ userId: 1 }, { sparse: true })

module.exports = mongoose.model('Cart', CartSchema)