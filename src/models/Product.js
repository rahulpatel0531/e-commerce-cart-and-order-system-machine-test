const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: ""
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },
        images: {
            type: [{ type: String }],
        },
        category: {
            type: String,
            default: "general"
        },
        metadata: {
            type: Object,
            default: {}
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model('Product', ProductSchema)