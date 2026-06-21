const router = require('express').Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/password', authenticate, changePassword);

module.exports = router;
