const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, paymentController.createPayment);
router.get('/', auth, paymentController.getPayments);

module.exports = router;
