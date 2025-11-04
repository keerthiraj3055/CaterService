const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/uploadMiddleware');
const auth = require('../middleware/authMiddleware');

// Get all users (Admin only)
router.get('/', auth, userController.getAllUsers);

// Create user (Admin only - for employee/corporate accounts)
router.post('/', auth, userController.createUser);

// Profile routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.patch('/profile/avatar', auth, upload.single('avatar'), userController.updateAvatar);

// Notifications (mock endpoint for now)
router.get('/notifications', auth, userController.getNotifications);

module.exports = router;
