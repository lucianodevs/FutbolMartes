const express = require('express');
const { loginHandler, registerHandler, profileHandler } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', loginHandler);
router.post('/register', registerHandler);
router.get('/profile', protect, profileHandler);

module.exports = router;
