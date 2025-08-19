const Product = require('../models/Product');

exports.createProduct = async (req, res, next) => {
    try {
        const body = req.body;
        const product = await Product.create(body)
        return res.status(201).json({ mesage: "Product added successfully!", product })
    } catch (error) {
        next(error)
    }
}

exports.getProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, q } = req.query;
        const filter = {};
        if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }];
        const products = await Product.find(filter).skip((page - 1) * limit).limit(Number(limit));
        const total = await Product.countDocuments(filter);
        return res.status(200).json({ mesage: "Product lists fetched", products, total })
    } catch (error) {
        next(error)
        // return res.status(500).json({ message: error.message || 'Server error'})
    }
}

exports.getProduct = async (req, res, next) => {
    try {
        const productId = req.params.id
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        return res.status(200).json({ mesage: "Fetch product details", product })
    } catch (error) {
        next(error)
    }
}

exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({ mesage: "Product details updated", product })
    } catch (error) {
        next(error)
    }
}


exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" })
        return res.status(200).json({ mesage: "Product deleted" })
    } catch (error) {
        next(error)
    }
}