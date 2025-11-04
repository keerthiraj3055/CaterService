const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const auth = require('../middleware/authMiddleware');

router.get('/', serviceController.getServices);
router.post('/', auth, serviceController.addService);
router.put('/:id', auth, serviceController.updateService);
router.delete('/:id', auth, serviceController.deleteService);

module.exports = router;
