const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addToCart = async (req, res, next) => {
    try {
        const { productId, tempId, qty = 1 } = req.body;
        const userId = req.user?.id || null;
        if (!productId) {
            return res.status(400).json({ message: "productId required" })
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // check cart
        let cart;
        if (userId) {
            cart = await Cart.findOne({ userId })
        } else {
            cart = await Cart.findOne({ tempId })
        }

        if (!cart) {
            cart = new Cart({ userId: userId || null, tempId: tempId || null, items: [] })
        }

        const idx = cart.items.findIndex(p => p.product.equals(product._id))

        if (idx > -1) {
            cart.items[idx].qty += qty;
            cart.items[idx].price = product.price
        } else {
            cart.items.push({ product: product._id, qty, price: product.price })
        }

        await cart.save();
        return res.status(200).json({ message: "Product added to cart", cart })
    } catch (error) {
        next(error)
    }
}


exports.getCart = async (req, res, next) => {
    try {
        const userId = req.user?.id || null;
        const tempId = req.query.tempId || null;

        console.log('tempId', tempId)

        const identity = (userId) ? { userId } : { tempId };
        const cart = await Cart.findOne(identity).populate('items.product')

        return res.status(200).json({ message: 'Fetch cart details', cart: cart || { item: null } })

    } catch (error) {
        next(error)
    }
}

exports.updateCartItem = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const { qty } = req.body;
        const userId = req.user?.id || null;
        const tempId = req.body.tempId || null;
        const identity = (userId) ? { userId } : { tempId };
        const cart = await Cart.findOne(identity);
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        let item = cart.items.id(itemId);
        console.log('item ', item);

        if (!item) return res.status(404).json({ message: 'Item not found' });

        if (qty <= 0) {
            item.remove();
        } else {
            const product = await Product.findById(item.product)
            if (product.stock < qty) {
                return res.status(400).json({ message: 'Insufficient stock' });
            }
            item.qty = qty
            item.price = product.price
        }

        await cart.save();
        return res.status(200).json({ message: "Product qty updated", cart })
    } catch (error) {
        next(error)
    }
}

exports.clearCart = async (req, res, next) => {
    try {
        const userId = req.user?.id || null;
        const tempId = req.body?.id || null;
        const identity = userId ? { userId } : { tempId };
        await Cart.deleteOne(identity);
        return res.status(200).json({ message: "Cart cleared" })
    } catch (error) {
        next(error);
    }
}