const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/authMiddleware');

router.get('/summary', auth, reportController.getSummary);
router.get('/revenue-trend', auth, reportController.getRevenueTrend);
router.get('/orders-by-category', auth, reportController.getOrdersByCategory);

module.exports = router;
