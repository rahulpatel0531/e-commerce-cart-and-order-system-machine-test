const { createProduct, getProducts, getProduct, updateProduct, deleteProduct  } = require('../controller/product.controller');
const auth = require('../middleware/auth.middleware');

const router = require('express').Router();

// Public routes
router.get('/',  getProducts);
router.get('/:id',  getProduct);


// protected routes
router.post('/', auth,  createProduct);
router.put('/:id', auth,  updateProduct);
router.delete('/:id', auth,  deleteProduct);


module.exports = router;