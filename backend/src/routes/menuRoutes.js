const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const auth = require('../middleware/authMiddleware');

router.get('/', menuController.getMenu);
router.get('/by-program', menuController.getMenuByProgram);
router.post('/', auth, menuController.addMenuItem);
router.put('/:id', auth, menuController.updateMenuItem);
router.delete('/:id', auth, menuController.deleteMenuItem);

module.exports = router;
