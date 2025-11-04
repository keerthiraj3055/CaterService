const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, orderController.createOrder);
router.get('/', auth, orderController.getOrders);
router.get('/:id/invoice', auth, orderController.downloadInvoice);
router.put('/:id/pay', auth, orderController.payOrder);
// Accept POST as well to be resilient to clients using POST
router.post('/:id/pay', auth, orderController.payOrder);

module.exports = router;
