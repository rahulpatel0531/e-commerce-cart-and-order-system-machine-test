const { checkout } = require('../controller/order.controller');
const router = require('express').Router();
const auth = require('../middleware/auth.middleware');

router.post('/checkout',  auth,  checkout);

module.exports = router;