const { addToCart, getCart, updateCartItem, clearCart } = require('../controller/cart.controller');
const auth = require('../middleware/auth.middleware');
const router = require('express').Router();

router.post('/add', addToCart);
router.get('/', getCart)
router.patch('/item/:itemId', updateCartItem);
router.post('/clear', clearCart);

module.exports = router;