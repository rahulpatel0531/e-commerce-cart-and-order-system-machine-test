const mongoose = require("mongoose");
const Product = require('../models/Product')
const Cart = require("../models/Cart");
const Promo = require("../models/Promo");
const Order = require("../models/Order");



// exports.checkout = async (req, res, next) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         const userId = req.user?.id || null;
//         const tempId = req.body?.id || null;
//         const identity = userId ? { userId } : { tempId };

//         // 1) load cart
//         const cart = await Cart.findOne(identity).populate('items.product').session(session);
//         if (!cart || cart.items.length === 0) throw { status: 400, message: 'Cart empty' };

//         // 2) compute totals
//         let total = 0;
//         for (const item of cart.items) {
//             const product = await Product.findById(item.product._id).session(session);
//             if (!product) {
//                 throw { status: 400, message: `Product ${item.product._id} not found` };
//             }

//             if (product.stock < item.qty) throw { status: 400, message: `Insufficient stock for ${product._id}` };
//             total += (item.price || product.price) * item.qty;
//         }

//         // 3) promo handling
//         let discount = 0;
//         let promoCode = req.body?.promoCode || null;

//         if (promoCode) {
//             let promo = await Promo.findOne({ code: promoCode.toUpperCase(), active: true }).session(session);
//             if (!promo) throw { status: 400, message: "Invalid Promo" }
//             if (promo.expiresAt && promo.expiresAt < new Date()) {
//                 throw { status: 400, message: "Promo expired" }
//             }
//             if (promo.usageLimit && promo.usageLimit > 0 && promo.usedCount >= promo.usageLimit) {
//                 throw { status: 400, message: "Promo usage exhausted" }
//             }

//             if (promo.minOrderValue && total < promo.minOrderValue) {
//                 throw { status: 400, message: `Minimum order ${promo.minOrderValue} not reached` }
//             }
//             if (promo.type === 'percent') {
//                 discount = (total * promo.value) / 100;
//             } else {
//                 discount = promo.value;
//             }

//             promo.usedCount += 1;
//             await promo.save({ session })
//         }

//         const finalAmount = Math.max(0, total - discount);

//         // 4) decrement stock atomically
//         for (const item of cart.items) {
//             // ensure product has enough stock and decrement
//             const updated = await Product.findOneAndUpdate(
//                 { _id: item.product._id, stock: { $gte: item.qty } },
//                 { $inc: { stock: -item.qty } },
//                 { new: true, session }
//             );

//             if (!updated) throw { status: 400, message: `Insufficient stock for ${item.product._id}` };
//         }

//         const order = await Order.create([{
//             userId,
//             items: cart.items.map((it) => ({ product: it.product._id, qty: it.qty, price: it.price })),
//             total, discount, finalAmount, promoCode
//         }], { session });

//         // Clear cart
//         await Cart.deleteOne({ _id: cart._id }).session(session);

//         await session.commitTransaction();
//         session.endSession();

//         return res.status(201).json({ message: "Order Created", order: order[0] });
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         next(error)
//     }
// }


// Without transactions
exports.checkout = async (req, res, next) => {
    try {
        const userId = req.user?.id || null;
        const tempId = req.body?.tempId || null;

        //  Best pracices
        // if (userId && tempId) {
        //     const guestCart = await Cart.findOne({ tempId });
        //     if (guestCart) {
        //         await Cart.updateOne(
        //             { tempId },
        //             { $set: { userId }, $unset: { tempId: "" } }
        //         );
        //     }
        // }

        // For developement
         
        let identity = {};
        if (userId && tempId) {
            identity = { $or: [{ userId }, { tempId }] };
        } else if (userId) {
            identity = { userId };
        } else if (tempId) {
            identity = { tempId };
        }


        // 1) load cart
        const cart = await Cart.findOne(identity).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart empty' });
        }

        // 2) compute totals
        let total = 0;
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            if (!product) {
                return res.status(400).json({ message: `Product ${item.product._id} not found` });
            }

            if (product.stock < item.qty) {
                return res.status(400).json({ message: `Insufficient stock for ${product._id}` });
            }

            total += (item.price || product.price) * item.qty;
        }

        // 3) promo handling
        let discount = 0;
        let promoCode = req.body?.promoCode || null;

        if (promoCode) {
            let promo = await Promo.findOne({ code: promoCode.toUpperCase(), active: true });
            if (!promo) return res.status(400).json({ message: "Invalid Promo" });
            if (promo.expiresAt && promo.expiresAt < new Date()) {
                return res.status(400).json({ message: "Promo expired" });
            }
            if (promo.usageLimit && promo.usageLimit > 0 && promo.usedCount >= promo.usageLimit) {
                return res.status(400).json({ message: "Promo usage exhausted" });
            }

            if (promo.minOrderValue && total < promo.minOrderValue) {
                return res.status(400).json({ message: `Minimum order ${promo.minOrderValue} not reached` });
            }

            if (promo.type === 'percent') {
                discount = (total * promo.value) / 100;
            } else {
                discount = promo.value;
            }

            promo.usedCount += 1;
            await promo.save();
        }

        const finalAmount = Math.max(0, total - discount);

        // 4) decrement stock
        for (const item of cart.items) {
            const updated = await Product.findOneAndUpdate(
                { _id: item.product._id, stock: { $gte: item.qty } },
                { $inc: { stock: -item.qty } },
                { new: true }
            );

            if (!updated) {
                return res.status(400).json({ message: `Insufficient stock for ${item.product._id}` });
            }
        }

        // 5) create order
        const order = await Order.create({
            userId,
            items: cart.items.map((it) => ({
                product: it.product._id,
                qty: it.qty,
                price: it.price
            })),
            total,
            discount,
            finalAmount,
            promoCode
        });

        // 6) clear cart
        await Cart.deleteOne({ _id: cart._id });

        return res.status(201).json({ message: "Order Created", order });
    } catch (error) {
        next(error);
    }
};
