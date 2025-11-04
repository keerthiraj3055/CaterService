const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, reviewController.addReview);
router.get('/', reviewController.getReviews);

module.exports = router;
