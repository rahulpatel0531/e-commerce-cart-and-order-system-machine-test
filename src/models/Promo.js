const mongoose = require('mongoose');

const PromoSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            uppercase: true,
            unique: true,
        },
        type: {
            type: String,
            enum: ['percent', 'fixed'],
            default:"fixed",
            required: true
        },
        value: {
            type: Number,
            required: true
        },
        expiresAt: {
            type: Date,
            default: null
        },
        usageLimit: {
            type: Number,
            default: 0
        },
        usedCount: {
            type: Number,
            default: 0
        },
        minOrderValue: { type: Number, default: 0 },
        active: { type: Boolean, default: true }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model('Promo', PromoSchema)