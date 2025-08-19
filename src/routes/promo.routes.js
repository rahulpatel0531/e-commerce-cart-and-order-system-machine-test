const { createPromo, listPromos, getPromo, updatePromo, deletePromo } = require('../controller/promo.controller');
const auth = require('../middleware/auth.middleware');
const router = require('express').Router();

router.get('/:code', getPromo);
router.get('/', listPromos);
router.post('/', auth, createPromo);
router.patch('/:id', auth, updatePromo);
router.delete('/:id', auth, deletePromo);

module.exports = router